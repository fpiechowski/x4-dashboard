import React from 'react'
import { ShipStatus as ShipStatusType } from '../types/gameData'

interface Props {
  ship: ShipStatusType
}

function hullClass(pct: number): string {
  if (pct > 60) return ''
  if (pct > 30) return 'med'
  return 'low'
}

export function ShipShieldsWidget({ ship }: Props) {
  const pct = Math.max(0, Math.min(100, ship.shields))
  const clipId = React.useId()
  // Hexagon points: pointed left and right ends
  const points = '8,0 392,0 400,14 392,28 8,28 0,14'
  return (
    <div className="svg-bar-row">
      <div className="svg-bar-head">
        <span className="svg-bar-label">Shields</span>
        <span className="svg-bar-value shields-val">{pct.toFixed(0)}%</span>
      </div>
      <svg className="svg-bar-svg" viewBox="0 0 400 28" preserveAspectRatio="none">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <rect x="0" y="0" width={pct / 100} height="1" />
          </clipPath>
        </defs>
        {/* Frame — always full width */}
        <polygon
          points={points}
          fill="rgba(0,229,255,0.04)"
          stroke="rgba(0,229,255,0.25)"
          strokeWidth="1"
        />
        {/* Fill — clipped to pct% */}
        <polygon
          points={points}
          fill="var(--c-cyan)"
          stroke="none"
          clipPath={`url(#${clipId})`}
        />
      </svg>
    </div>
  )
}

export function ShipHullWidget({ ship }: Props) {
  const pct = Math.max(0, Math.min(100, ship.hull))
  const tone = hullClass(pct)
  const clipId = React.useId()
  // Armour plate: diagonal top-right cut, angled lower-left corner
  const points = '0,0 390,0 400,12 400,24 12,24 0,12'
  const fillColour =
    tone === 'low' ? 'var(--c-red)' :
    tone === 'med' ? 'var(--c-orange)' :
    'var(--c-green)'
  const strokeColour =
    tone === 'low' ? 'rgba(255,23,68,0.3)' :
    tone === 'med' ? 'rgba(255,109,0,0.3)' :
    'rgba(0,230,118,0.3)'
  const frameFill =
    tone === 'low' ? 'rgba(255,23,68,0.04)' :
    tone === 'med' ? 'rgba(255,109,0,0.04)' :
    'rgba(0,230,118,0.04)'
  return (
    <div className="svg-bar-row">
      <div className="svg-bar-head">
        <span className="svg-bar-label">Hull</span>
        <span className={`svg-bar-value hull-val ${tone}`}>{pct.toFixed(0)}%</span>
      </div>
      <svg className="svg-bar-svg" viewBox="0 0 400 24" preserveAspectRatio="none">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <rect x="0" y="0" width={pct / 100} height="1" />
          </clipPath>
        </defs>
        {/* Frame — always full width */}
        <polygon
          points={points}
          fill={frameFill}
          stroke={strokeColour}
          strokeWidth="1"
        />
        {/* Fill — clipped to pct% */}
        <polygon
          points={points}
          fill={fillColour}
          stroke="none"
          clipPath={`url(#${clipId})`}
          className={tone === 'low' ? 'hull-svg-low' : undefined}
        />
      </svg>
    </div>
  )
}

export function ShipCargoWidget(_props: Props) {
  return null
}

export function ShipStatusWidget({ ship }: Props) {
  return (
    <div className="ship-side-card">
      <div className="ship-side-label">Status</div>
      <div className="ship-side-pills">
        {ship.isDockedOrLanded && <span className="ship-pill">Docked</span>}
        {!ship.isDockedOrLanded && <span className="ship-pill dim">Nominal</span>}
      </div>
    </div>
  )
}
