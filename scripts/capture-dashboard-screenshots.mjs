#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { mkdir, readdir, rm, open } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const outDir = path.join(rootDir, 'docs', 'screenshots')

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3001'
const screenshotWaitMs = Number(process.env.SCREENSHOT_WAIT_MS || 2500)
const viewport = process.env.VIEWPORT || '1920,1080'
const [viewportWidth, viewportHeight] = viewport.split(',').map((v) => Number(v.trim()))

const expectedFiles = [
  'dashboard-flight-no-target.png',
  'dashboard-flight-classic.png',
  'dashboard-flight-combat-alert-target.png',
  'dashboard-flight-combat-missile-inbound.png',
  'dashboard-flight-speedometer-arc-boost-active.png',
  'dashboard-flight-speedometer-arc-travel-active.png',
  'dashboard-flight-speedometer-bar-boost-active.png',
  'dashboard-flight-speedometer-bar-travel-active.png',
  'dashboard-ship-controls.png',
  'dashboard-target.png',
  'dashboard-operations-overview.png',
  'dashboard-operations-intel.png',
  'dashboard-operations-missions.png',
  'dashboard-operations-trade.png',
]

function log(message) {
  process.stdout.write(`[screenshots] ${message}\n`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getCmd(base) {
  return process.platform === 'win32' ? `${base}.cmd` : base
}

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    let child
    if (process.platform === 'win32') {
      const psQuote = (value) => `'${String(value).replace(/'/g, "''")}'`
      const commandLine = `& ${psQuote(cmd)} ${args.map(psQuote).join(' ')}`
      child = spawn('powershell.exe', ['-NoProfile', '-Command', commandLine], {
        cwd: rootDir,
        stdio: options.stdio || 'inherit',
        shell: false,
        env: process.env,
      })
    } else {
      child = spawn(cmd, args, {
        cwd: rootDir,
        stdio: options.stdio || 'inherit',
        shell: false,
        env: process.env,
      })
    }

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`${cmd} ${args.join(' ')} failed with exit code ${code}`))
    })
  })
}

async function apiPost(route) {
  const response = await fetch(`${baseUrl}${route}`, { method: 'POST' })
  if (!response.ok) {
    throw new Error(`POST ${route} failed with status ${response.status}`)
  }
}

async function apiState() {
  const response = await fetch(`${baseUrl}/api/state`)
  if (!response.ok) {
    throw new Error(`/api/state failed with status ${response.status}`)
  }
  return response.json()
}

async function getAlertLevel() {
  const state = await apiState()
  return state?.combat?.alertLevel ?? 0
}

async function getMissileMode() {
  const state = await apiState()
  if (state?.combat?.missileIncoming) return 'incoming'
  if (state?.combat?.missileLockingOn) return 'lock'
  return 'none'
}

async function getBoosting() {
  const state = await apiState()
  return Boolean(state?.flight?.boosting)
}

async function getTravel() {
  const state = await apiState()
  return Boolean(state?.flight?.travelDrive ?? state?.flight?.travelMode)
}

async function setAlertLevel(target) {
  for (let i = 0; i < 14; i += 1) {
    if ((await getAlertLevel()) === target) return
    await apiPost('/api/mock/combat')
    await sleep(150)
  }
  throw new Error(`Failed to set alert level to ${target}`)
}

async function setMissileMode(target) {
  for (let i = 0; i < 14; i += 1) {
    if ((await getMissileMode()) === target) return
    await apiPost('/api/mock/missile')
    await sleep(150)
  }
  throw new Error(`Failed to set missile mode to ${target}`)
}

async function setBoosting(target) {
  for (let i = 0; i < 14; i += 1) {
    if ((await getBoosting()) === target) return
    await apiPost('/api/mock/boost')
    await sleep(150)
  }
  throw new Error(`Failed to set boosting to ${target}`)
}

async function setTravel(target) {
  for (let i = 0; i < 14; i += 1) {
    if ((await getTravel()) === target) return
    await apiPost('/api/mock/travel')
    await sleep(150)
  }
  throw new Error(`Failed to set travel drive to ${target}`)
}

async function waitForCondition(checkFn, label) {
  for (let i = 0; i < 90; i += 1) {
    const state = await apiState()
    if (checkFn(state)) return
    await sleep(200)
  }
  throw new Error(`Timed out waiting for ${label}`)
}

async function resetMockState() {
  await setAlertLevel(0)
  await setMissileMode('none')
  await setBoosting(false)
  await setTravel(false)
}

async function captureUrl(url, filename) {
  const outputPath = path.join(outDir, filename)
  log(`Capture ${url} -> docs/screenshots/${filename}`)
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({
      viewport: { width: viewportWidth, height: viewportHeight },
    })
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(screenshotWaitMs)
    await page.screenshot({ path: outputPath })
    await page.close()
  } finally {
    await browser.close()
  }
}

async function captureDashboard(dashboardId, filename) {
  const url = `${baseUrl}/?dashboard=${dashboardId}&speedometer=arc`
  await captureUrl(url, filename)
}

async function removeOldDashboardScreenshots() {
  await mkdir(outDir, { recursive: true })
  const entries = await readdir(outDir)
  const deletions = entries
    .filter((name) => name.startsWith('dashboard-') && name.endsWith('.png'))
    .map((name) => rm(path.join(outDir, name), { force: true }))
  await Promise.all(deletions)
}

async function waitForHealth() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`)
      if (response.ok) return
    } catch {
      // server not ready yet
    }
    await sleep(400)
  }
  throw new Error(`Mock server did not become ready at ${baseUrl}`)
}

async function listAndValidateOutputs() {
  const entries = (await readdir(outDir)).filter((name) => name.startsWith('dashboard-') && name.endsWith('.png'))
  const missing = expectedFiles.filter((name) => !entries.includes(name))
  if (missing.length > 0) {
    throw new Error(`Missing generated screenshots: ${missing.join(', ')}`)
  }
}

async function main() {
  log('Cleaning previous dashboard screenshots')
  await removeOldDashboardScreenshots()

  log('Building client bundle')
  await run(getCmd('npm'), ['run', 'build'])

  log('Ensuring Playwright Chromium is installed')
  await run(getCmd('npx'), ['-y', 'playwright', 'install', 'chromium'])

  log('Starting mock server')
  const serverLogPath = path.join(rootDir, 'tmp-screenshots-server.log')
  const serverLog = await open(serverLogPath, 'w')
  const server = spawn(process.execPath, ['server/index.js', '--mock'], {
    cwd: rootDir,
    stdio: ['ignore', serverLog.fd, serverLog.fd],
    shell: false,
    env: process.env,
  })

  try {
    await waitForHealth()

    log('Capturing baseline dashboards')
    await resetMockState()
    await captureDashboard('flight', 'dashboard-flight-no-target.png')
    await captureDashboard('flight-classic', 'dashboard-flight-classic.png')
    await captureDashboard('ship-controls', 'dashboard-ship-controls.png')
    await captureDashboard('target', 'dashboard-target.png')
    await captureDashboard('operations', 'dashboard-operations-overview.png')
    await captureDashboard('operations-intel', 'dashboard-operations-intel.png')
    await captureDashboard('operations-missions', 'dashboard-operations-missions.png')
    await captureDashboard('operations-trade', 'dashboard-operations-trade.png')

    log('Capturing flight combat variants')
    await resetMockState()
    await setAlertLevel(1)
    await setMissileMode('lock')
    await captureDashboard('flight', 'dashboard-flight-combat-alert-target.png')

    await setAlertLevel(2)
    await setMissileMode('incoming')
    await captureDashboard('flight-classic', 'dashboard-flight-combat-missile-inbound.png')

    log('Capturing speedometer variants')
    await resetMockState()
    await setBoosting(true)
    await waitForCondition((state) => {
      const speed = Number(state?.flight?.speed ?? 0)
      const maxSpeed = Number(state?.flight?.maxSpeed ?? 480)
      return Boolean(state?.flight?.boosting) && speed > maxSpeed
    }, 'boost overspeed state')
    await captureUrl(`${baseUrl}/?dashboard=flight&speedometer=arc`, 'dashboard-flight-speedometer-arc-boost-active.png')

    await resetMockState()
    await setTravel(true)
    await waitForCondition((state) => {
      const speed = Number(state?.flight?.speed ?? 0)
      const maxBoost = Number(state?.flight?.maxBoostSpeed ?? 960)
      const travel = Boolean(state?.flight?.travelDrive ?? state?.flight?.travelMode)
      return travel && speed > maxBoost
    }, 'travel state')
    await captureUrl(`${baseUrl}/?dashboard=flight&speedometer=arc`, 'dashboard-flight-speedometer-arc-travel-active.png')

    await resetMockState()
    await setBoosting(true)
    await waitForCondition((state) => {
      const speed = Number(state?.flight?.speed ?? 0)
      const maxSpeed = Number(state?.flight?.maxSpeed ?? 480)
      return Boolean(state?.flight?.boosting) && speed > maxSpeed
    }, 'boost overspeed state (bar)')
    await captureUrl(`${baseUrl}/?dashboard=flight&speedometer=bar`, 'dashboard-flight-speedometer-bar-boost-active.png')

    await resetMockState()
    await setTravel(true)
    await waitForCondition((state) => {
      const speed = Number(state?.flight?.speed ?? 0)
      const maxBoost = Number(state?.flight?.maxBoostSpeed ?? 960)
      const travel = Boolean(state?.flight?.travelDrive ?? state?.flight?.travelMode)
      return travel && speed > maxBoost
    }, 'travel state (bar)')
    await captureUrl(`${baseUrl}/?dashboard=flight&speedometer=bar`, 'dashboard-flight-speedometer-bar-travel-active.png')

    await listAndValidateOutputs()
    log('Screenshot capture completed')
  } finally {
    server.kill()
    await serverLog.close()
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})
