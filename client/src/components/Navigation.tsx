import React from 'react'
import { Navigation as NavType, ShipStatus, SystemFlags } from '../types/gameData'
import { ArwesPanel } from './ArwesPanel'

interface Props {
  nav: NavType
  ship?: ShipStatus
  systems?: SystemFlags
}

const DIRS_16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

function compassLabel(deg: number): string {
  return DIRS_16[Math.round(deg / 22.5) % 16]
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function normalizeHeading(deg: number): number {
  return ((deg % 360) + 360) % 360
}

function cardinalFromDeg(deg: number): string {
  const d = normalizeHeading(deg)
  if (d === 0) return 'N'
  if (d === 90) return 'E'
  if (d === 180) return 'S'
  if (d === 270) return 'W'
  return `${d}`
}

function Chip({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span
      style={{
        fontSize: '8px',
        letterSpacing: '1.5px',
        fontFamily: 'var(--font-mono)',
        padding: '2px 6px',
        border: `1px solid ${border}`,
        color,
        background: bg,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  )
}

function HeadingLine({ heading, inTravel }: { heading: number; inTravel: boolean }) {
  const marks = Array.from({ length: 13 }, (_, i) => {
    const offset = (i - 6) * 15
    const value = normalizeHeading(heading + offset)
    const major = offset % 30 === 0
    return {
      left: `${(i / 12) * 100}%`,
      major,
      label: major ? cardinalFromDeg(value) : '',
    }
  })

  return (
    <div className="nav-heading-line">
      {marks.map((m, idx) => (
        <div key={idx} className="nav-heading-mark" style={{ left: m.left }}>
          <div className={`nav-heading-tick ${m.major ? 'major' : 'minor'}`} />
          {m.label && <div className="nav-heading-mark-label">{m.label}</div>}
        </div>
      ))}
      <div className="nav-heading-caret" style={{ borderTopColor: inTravel ? '#ea80fc' : '#00e5ff' }} />
    </div>
  )
}

function RetroSpeedometer({
  speed,
  maxSpeed,
  maxBoost,
  inTravel,
}: {
  speed: number
  maxSpeed: number
  maxBoost: number
  inTravel: boolean
}) {
  const displayMax = Math.max(1, inTravel && maxBoost > 0 ? maxBoost : maxSpeed > 0 ? maxSpeed : speed)
  const speedPct = clamp(speed / displayMax, 0, 1)
  const barCount = 24
  const bars = Array.from({ length: barCount }, (_, i) => {
    const threshold = (i + 1) / barCount
    const active = speedPct >= threshold
    const heightPct = 24 + (i / (barCount - 1)) * 76
    return { active, heightPct }
  })

  return (
    <div className="nav-retro-speedometer">
      <div className="nav-retro-topline">
        <span>SPEED GRAPH</span>
        <span>{displayMax.toFixed(0)} MAX</span>
      </div>

      <div className="nav-retro-bars">
        {bars.map((bar, idx) => (
          <div
            key={idx}
            className={`nav-retro-bar ${bar.active ? 'active' : 'idle'} ${inTravel ? 'travel' : 'normal'}`}
            style={{ height: `${bar.heightPct}%` }}
          />
        ))}
      </div>

      <div className="nav-retro-readout">
        <span className={`nav-retro-speed-value ${inTravel ? 'travel' : 'normal'}`}>{speed.toFixed(0)}</span>
        <span className="nav-retro-speed-unit">m/s</span>
      </div>

      <div className="nav-retro-footer">
        <span>0</span>
        <span>{Math.round(speedPct * 100)}%</span>
      </div>

      {inTravel && maxBoost > 0 && (
        <div className="nav-retro-boost-note">Travel mode scale uses boost max {maxBoost.toFixed(0)}</div>
      )}
    </div>
  )
}

export function Navigation({ nav, ship, systems }: Props) {
  const heading = normalizeHeading(nav.heading)
  const compassDir = compassLabel(heading)
  const maxSpeed = ship?.maxSpeed ?? 0
  const maxBoost = ship?.maxBoostSpeed ?? 0
  const isWanted = nav.legalStatus?.toLowerCase() === 'wanted'
  const isClean = nav.legalStatus?.toLowerCase() === 'clean'
  const hasCoords =
    Math.abs(nav.coordinates.x) > 0.001 ||
    Math.abs(nav.coordinates.y) > 0.001 ||
    Math.abs(nav.coordinates.z) > 0.001

  return (
    <ArwesPanel
      title="Navigation"
      titleIcon="*"
      color={isWanted ? 'danger' : 'primary'}
      style={{ aspectRatio: '3 / 4', minHeight: '320px' }}
    >
      <div className="nav-vertical">
        <div className="nav-heading-compact">
          <div className="nav-heading-caption">Heading</div>
          <div className="nav-heading-main">
            <span>{heading.toFixed(0)}°</span>
            <span className="nav-heading-main-dir">{compassDir}</span>
          </div>
          <HeadingLine heading={heading} inTravel={nav.inTravelMode} />
        </div>

        <RetroSpeedometer speed={nav.speed} maxSpeed={maxSpeed} maxBoost={maxBoost} inTravel={nav.inTravelMode} />

        <div className="nav-sector-under">
          <div className="nav-sector-label">Sector</div>
          <div className={`nav-sector-name ${nav.inTravelMode ? 'travel' : ''}`}>{nav.sector || '-'}</div>
          {nav.cluster && nav.cluster !== nav.sector && <div className="nav-sector-cluster">{nav.cluster}</div>}
        </div>

        <div className="nav-chips-row">
          {nav.inTravelMode && (
            <Chip
              label="Travel Drive"
              color="#ea80fc"
              bg="rgba(234,128,252,0.08)"
              border="rgba(234,128,252,0.35)"
            />
          )}
          {systems?.autopilot && (
            <Chip
              label="Autopilot"
              color="var(--c-cyan)"
              bg="rgba(0,229,255,0.08)"
              border="rgba(0,229,255,0.35)"
            />
          )}
          {systems?.massLocked && (
            <Chip
              label="Mass Lock"
              color="var(--c-orange)"
              bg="rgba(255,109,0,0.08)"
              border="rgba(255,109,0,0.35)"
            />
          )}
          {nav.legalStatus && (
            <Chip
              label={nav.legalStatus}
              color={isClean ? 'var(--c-green)' : isWanted ? 'var(--c-red)' : 'var(--c-text-dim)'}
              bg={isClean ? 'rgba(0,230,118,0.06)' : isWanted ? 'rgba(255,23,68,0.08)' : 'transparent'}
              border={isClean ? 'rgba(0,230,118,0.3)' : isWanted ? 'rgba(255,23,68,0.4)' : 'var(--c-border)'}
            />
          )}
        </div>

        {hasCoords && (
          <div className="nav-coords-block">
            <div className="nav-coords-label">Coordinates</div>
            <div className="nav-coords-grid">
              {(['X', 'Y', 'Z'] as const).map((axis, i) => {
                const val = [nav.coordinates.x, nav.coordinates.y, nav.coordinates.z][i]
                return (
                  <div key={axis} className="nav-coords-cell">
                    <div className="nav-coords-axis">{axis}</div>
                    <div className="nav-coords-value">
                      {val >= 0 ? '+' : ''}
                      {val.toFixed(0)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </ArwesPanel>
  )
}

