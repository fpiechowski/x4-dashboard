function getInput(id) {
  return document.getElementById(id)
}

function isEditingHostSettings() {
  const activeElement = document.activeElement
  if (!activeElement) return false

  return activeElement.matches('#allow-remote-controls, #force-activate-game-window, #game-window-title, #autohotkey-path, .keybinding-input')
}

function setText(id, value) {
  document.getElementById(id).textContent = value
}

function setFeedback(id, message = '', tone = 'info') {
  const node = document.getElementById(id)
  node.textContent = message
  node.classList.remove('info', 'success', 'error')

  if (!message) {
    node.hidden = true
    return
  }

  node.classList.add(tone)
  node.hidden = false
}

const feedbackHideTimers = {}

function showTemporaryFeedback(id, message, tone = 'info', duration = 3500) {
  setFeedback(id, message, tone)

  if (feedbackHideTimers[id]) {
    window.clearTimeout(feedbackHideTimers[id])
  }

  feedbackHideTimers[id] = window.setTimeout(() => {
    setFeedback(id, '')
    feedbackHideTimers[id] = null
  }, duration)
}

function setCardState(id, status, copy, tone, linkPath = '') {
  const label = document.getElementById(id)
  const card = label.closest('.status-card')
  label.textContent = status
  label.nextElementSibling.textContent = copy
  card.classList.remove('good', 'warn', 'bad')
  if (tone) {
    card.classList.add(tone)
  }

  let linkNode = card.querySelector('.status-card-link')
  if (!linkPath) {
    if (linkNode) {
      linkNode.remove()
    }
    return
  }

  if (!linkNode) {
    linkNode = document.createElement('button')
    linkNode.className = 'status-card-link'
    card.appendChild(linkNode)
  }

  linkNode.textContent = 'Open location'
  linkNode.onclick = () => {
    void window.x4Desktop.openPath(linkPath)
  }
}

function renderKeybindings(keybindings) {
  const listNode = document.getElementById('keybindings-list')
  listNode.innerHTML = ''

  for (const [action, binding] of Object.entries(keybindings || {})) {
    const row = document.createElement('div')
    row.className = 'keybinding-row'

    const meta = document.createElement('div')
    meta.className = 'keybinding-meta'

    const label = document.createElement('div')
    label.className = 'keybinding-label'
    label.textContent = binding.label

    const description = document.createElement('div')
    description.className = 'keybinding-description'
    description.textContent = binding.description

    meta.append(label, description)

    const input = document.createElement('input')
    input.className = 'keybinding-input'
    input.type = 'text'
    input.value = binding.key || ''
    input.placeholder = 'e.g. {F1}'
    input.spellcheck = false
    input.dataset.action = action
    input.addEventListener('input', () => {
      scheduleKeybindingsSave('Key bindings saved.')
    })

    const testButton = document.createElement('button')
    testButton.className = 'secondary-button keybinding-test'
    testButton.textContent = 'Test'
    testButton.addEventListener('click', async () => {
      setFeedback('keybindings-feedback', `Testing ${binding.label}...`, 'info')

      try {
        await window.x4Desktop.testKeybinding(action)
        showTemporaryFeedback('keybindings-feedback', `${binding.label} sent.`, 'success')
      } catch (error) {
        showTemporaryFeedback('keybindings-feedback', error instanceof Error ? error.message : 'Failed to test keybinding.', 'error', 5000)
      }
    })

    row.append(meta, input, testButton)
    listNode.appendChild(row)
  }
}

async function loadState() {
  const state = await window.x4Desktop.getState()
  const editingHostSettings = isEditingHostSettings()

  const localUrl = state.localUrl || '-'
  const lanUrl = state.lanUrl || 'Unavailable on this machine'

  setText('local-url', localUrl)
  setText('lan-url', lanUrl)
  setText('log-path', state.logPath || '-')
  setText('startup-summary', `Port ${state.startup.port}${state.startup.mockMode ? ' · Mock mode active' : ''}`)

  const statusNode = document.getElementById('server-status')
  statusNode.textContent = state.serverRunning ? 'Online' : 'Offline'
  statusNode.className = `status-pill ${state.serverRunning ? 'online' : 'offline'}`
  setText('server-mode', state.usingExistingServer ? 'Connected to an already running local server on this port.' : 'Launcher is hosting its own local server process.')

  const startupAlert = document.getElementById('startup-alert')
  if (state.startupError) {
    startupAlert.hidden = false
    setText('startup-alert-copy', state.startupError)
  } else {
    startupAlert.hidden = true
    setText('startup-alert-copy', '-')
  }

  document.getElementById('open-local').disabled = !state.localUrl
  document.getElementById('copy-local').disabled = !state.localUrl
  document.getElementById('open-lan').disabled = !state.lanUrl
  document.getElementById('copy-lan').disabled = !state.lanUrl

  const health = state.health || null
  setText('client-count', `${health?.wsClientCount || 0} connected`)
  setText('remote-controls-status', health?.remoteControlsEnabled ? 'LAN enabled' : 'Local only')
  setText('remote-controls-copy', health?.remoteControlsEnabled
    ? 'Trusted LAN clients can trigger host-side control actions.'
    : 'Dashboard viewing works over LAN, but control endpoints stay on the host machine.')

  const ahk = state.diagnostics?.autoHotkey
  setCardState(
    'ahk-status',
    ahk?.available ? 'Detected' : 'Not detected',
    ahk?.available
      ? `Using ${ahk.resolvedPath}`
      : 'AutoHotkey is optional, but recommended for reliable in-game button presses on Windows.',
    ahk?.available ? 'good' : 'warn',
    ahk?.available ? ahk.resolvedPath : '',
  )

  const lanDetected = Boolean(state.diagnostics?.lanDetected && state.lanUrl)
  setCardState(
    'lan-detected-status',
    lanDetected ? 'LAN URL ready' : 'LAN IP unavailable',
    lanDetected
      ? 'Other devices on the same trusted network can open the LAN URL directly.'
      : 'Connect the host to a local network to enable multi-device browser access.',
    lanDetected ? '' : 'warn',
  )

  const gameInstall = state.diagnostics?.gameInstall
  setCardState(
    'game-path-status',
    gameInstall?.available ? 'Detected' : 'Not detected',
    gameInstall?.available
      ? gameInstall.resolvedPath
      : 'Could not detect a local X4 installation path automatically. You can still use mock mode or continue configuring the bridge manually.',
    gameInstall?.available ? 'good' : 'warn',
    gameInstall?.available ? gameInstall.resolvedPath : '',
  )

  const bridgeInstall = state.diagnostics?.bridgeInstall
  setCardState(
    'game-feed-status',
    bridgeInstall?.available
      ? (health?.externalConnected ? 'Detected and connected' : 'Detected')
      : (state.startup.mockMode ? 'Mock feed active' : 'Bridge not found'),
    bridgeInstall?.available
      ? bridgeInstall.resolvedPath
      : 'Install the x4_dashboard_bridge extension into the X4 extensions folder to receive real game data.',
    bridgeInstall?.available ? 'good' : 'warn',
    bridgeInstall?.available ? bridgeInstall.resolvedPath : '',
  )

  if (!editingHostSettings) {
    getInput('allow-remote-controls').checked = Boolean(state.runtimeConfig.allowRemoteControls)
    getInput('force-activate-game-window').checked = Boolean(state.runtimeConfig.forceActivateGameWindow)
    getInput('game-window-title').value = state.runtimeConfig.gameWindowTitle || ''
    getInput('autohotkey-path').value = state.runtimeConfig.autoHotkeyPath || ''

    renderKeybindings(state.keybindings?.bindings)
  }

}

function bindAction(id, handler) {
  document.getElementById(id).addEventListener('click', handler)
}

let runtimeConfigSaveTimer = null
let keybindingsSaveTimer = null

async function saveRuntimeConfig(feedback = 'Host settings saved.') {
  setFeedback('settings-feedback', 'Saving...', 'info')

  const nextConfig = {
    allowRemoteControls: getInput('allow-remote-controls').checked,
    forceActivateGameWindow: getInput('force-activate-game-window').checked,
    gameWindowTitle: getInput('game-window-title').value,
    autoHotkeyPath: getInput('autohotkey-path').value,
  }

  try {
    await window.x4Desktop.updateRuntimeConfig(nextConfig)
    showTemporaryFeedback('settings-feedback', feedback, 'success')
    await loadState()
  } catch (error) {
    showTemporaryFeedback('settings-feedback', error instanceof Error ? error.message : 'Failed to save settings.', 'error', 5000)
  }
}

function scheduleRuntimeConfigSave(feedback = 'Host settings saved.') {
  if (runtimeConfigSaveTimer) {
    window.clearTimeout(runtimeConfigSaveTimer)
  }

  runtimeConfigSaveTimer = window.setTimeout(() => {
    runtimeConfigSaveTimer = null
    void saveRuntimeConfig(feedback)
  }, 300)
}

async function saveKeybindings(feedback = 'Key bindings saved.') {
  setFeedback('keybindings-feedback', 'Saving...', 'info')

  try {
    const updates = {}
    document.querySelectorAll('.keybinding-input').forEach((input) => {
      updates[input.dataset.action] = { key: input.value }
    })

    await window.x4Desktop.updateKeybindings(updates)
    showTemporaryFeedback('keybindings-feedback', feedback, 'success')
    await loadState()
  } catch (error) {
    showTemporaryFeedback('keybindings-feedback', error instanceof Error ? error.message : 'Failed to save key bindings.', 'error', 5000)
  }
}

function scheduleKeybindingsSave(feedback = 'Key bindings saved.') {
  if (keybindingsSaveTimer) {
    window.clearTimeout(keybindingsSaveTimer)
  }

  keybindingsSaveTimer = window.setTimeout(() => {
    keybindingsSaveTimer = null
    void saveKeybindings(feedback)
  }, 300)
}

bindAction('refresh-status', () => {
  void loadState()
})

window.setInterval(() => {
  void loadState()
}, 3000)

bindAction('open-local', async () => {
  const state = await window.x4Desktop.getState()
  if (state.localUrl) await window.x4Desktop.openUrl(state.localUrl)
})

bindAction('copy-local', async () => {
  const state = await window.x4Desktop.getState()
  if (state.localUrl) await window.x4Desktop.copyText(state.localUrl)
})

bindAction('open-lan', async () => {
  const state = await window.x4Desktop.getState()
  if (state.lanUrl) await window.x4Desktop.openUrl(state.lanUrl)
})

bindAction('copy-lan', async () => {
  const state = await window.x4Desktop.getState()
  if (state.lanUrl) await window.x4Desktop.copyText(state.lanUrl)
})

bindAction('open-log', () => {
  void window.x4Desktop.showLogLocation()
})

getInput('allow-remote-controls').addEventListener('change', () => {
  void saveRuntimeConfig('Host settings saved.')
})

getInput('force-activate-game-window').addEventListener('change', () => {
  void saveRuntimeConfig('Host settings saved.')
})

getInput('game-window-title').addEventListener('input', () => {
  scheduleRuntimeConfigSave('Host settings saved.')
})

getInput('autohotkey-path').addEventListener('input', () => {
  scheduleRuntimeConfigSave('Host settings saved.')
})

void loadState()
