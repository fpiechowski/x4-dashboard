import React from 'react'
import { ShipStatus as ShipStatusType } from '../types/gameData'

interface Props {
  ship: ShipStatusType
}

const CELL_COUNT = 30
const CELLS = Array.from({ length: CELL_COUNT })

function hullClass(pct: number): string {
  if (pct > 60) return ''
  if (pct > 30) return 'med'
  return 'low'
}

export function ShipShieldsWidget({ ship }: Props) {
  const pct = Math.max(0, Math.min(100, ship.shields))
  const filledCount = Math.round((pct / 100) * CELL_COUNT)
  return (
    <div className="para-bar-row">
      <div className="para-bar-head">
        <span className="para-bar-label">Shields</span>
        <span className="para-bar-value shields-val">{pct.toFixed(0)}%</span>
      </div>
      <div className="para-bar-cells">
        {CELLS.map((_, i) => (
          <div
            key={i}
            className={`para-cell ${i < filledCount ? 'filled shields' : 'empty'}`}
          />
        ))}
      </div>
    </div>
  )
}

export function ShipHullWidget({ ship }: Props) {
  const pct = Math.max(0, Math.min(100, ship.hull))
  const filledCount = Math.round((pct / 100) * CELL_COUNT)
  const tone = hullClass(pct)
  const filledClass = tone === 'low' ? 'hull-low' : tone === 'med' ? 'hull-med' : 'hull-high'
  return (
    <div className="para-bar-row">
      <div className="para-bar-head">
        <span className="para-bar-label">Hull</span>
        <span className={`para-bar-value hull-val ${tone}`}>{pct.toFixed(0)}%</span>
      </div>
      <div className="para-bar-cells">
        {CELLS.map((_, i) => (
          <div
            key={i}
            className={`para-cell ${i < filledCount ? `filled ${filledClass}` : 'empty'}`}
          />
        ))}
      </div>
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
