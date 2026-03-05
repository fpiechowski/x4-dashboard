import React from 'react'
import { ShipStatus as ShipStatusType } from '../types/gameData'
import { ArwesPanel } from './ArwesPanel'

interface Props {
  ship: ShipStatusType
}

const TICKS = Array.from({ length: 10 })

function hullColorClass(pct: number): string {
  if (pct > 60) return ''
  if (pct > 30) return 'med'
  return 'low'
}

export function ShipStatus({ ship }: Props) {
  const { hull, shields, shieldsUp, boostEnergy, speed, overHeating } = ship

  const hullPct    = Math.max(0, Math.min(100, hull))
  const shieldsPct = Math.max(0, Math.min(100, shields))
  const boostPct   = Math.max(0, Math.min(100, boostEnergy))
  const hullCls    = hullColorClass(hullPct)

  return (
    <ArwesPanel
      title="Ship Status"
      titleIcon="◉"
      color="primary"
    >
      <div className="status-bars">
        {/* ── Shields ─────────────────────────── */}
        <div className="status-bar-group">
          <div className="status-bar-header">
            <span className="status-bar-label">
              {shieldsUp ? '◈ Shields' : '◈ Shields — DOWN'}
            </span>
            <span
              className="status-bar-value shields-val"
              style={!shieldsUp ? { color: 'var(--c-text-dim)' } : undefined}
            >
              {shieldsPct.toFixed(0)}%
            </span>
          </div>
          <div className="status-bar-track">
            <div
              className={`status-bar-fill shields${!shieldsUp ? ' off' : shieldsPct < 25 ? ' low' : ''}`}
              style={{ width: `${shieldsPct}%` }}
            />
            <div className="status-bar-ticks">
              {TICKS.map((_, i) => <div key={i} className="status-bar-tick" />)}
            </div>
          </div>
        </div>

        {/* ── Hull ────────────────────────────── */}
        <div className="status-bar-group">
          <div className="status-bar-header">
            <span className="status-bar-label">◆ Hull Integrity</span>
            <span className={`status-bar-value hull-val ${hullCls}`}>
              {hullPct.toFixed(0)}%
            </span>
          </div>
          <div className="status-bar-track">
            <div
              className={`status-bar-fill hull ${hullCls}`}
              style={{ width: `${hullPct}%` }}
            />
            <div className="status-bar-ticks">
              {TICKS.map((_, i) => <div key={i} className="status-bar-tick" />)}
            </div>
          </div>
        </div>

        {/* Heat Warning Strip */}
        {overHeating && (
          <div className="heat-warning-bar" title="⚠ OVERHEATING" />
        )}

        {/* ── Boost Energy + Speed ─────────────── */}
        <div className="flex-row" style={{ gap: '16px', marginTop: '4px' }}>
          <div style={{ flex: 1 }}>
            <div className="status-bar-header">
              <span className="status-bar-label" style={{ fontSize: '9px' }}>▲ Boost Energy</span>
              <span style={{ fontSize: '12px', color: 'var(--c-cyan)', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
                {boostPct.toFixed(0)}%
              </span>
            </div>
            <div className="status-bar-track" style={{ height: '10px' }}>
              <div className="status-bar-fill shields" style={{ width: `${boostPct}%` }} />
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '90px' }}>
            <div className="nav-cell-label">Speed</div>
            <div className="nav-cell-value speed-val">
              {speed.toFixed(0)}
              <span className="nav-cell-unit">m/s</span>
            </div>
            {ship.maxSpeed > 0 && (
              <div style={{ fontSize: '9px', color: 'var(--c-text-dim)' }}>
                / {ship.maxSpeed.toFixed(0)} max
              </div>
            )}
          </div>
        </div>

        {/* ── Fuel / Cargo ─────────────────────── */}
        {(ship.fuel !== null || ship.cargo > 0) && (
          <div className="flex-row" style={{ gap: '20px', marginTop: '4px' }}>
            {ship.fuel !== null && (
              <div>
                <div className="nav-cell-label">Fuel</div>
                <div style={{ fontSize: '13px', color: 'var(--c-text)', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
                  {ship.fuel.toFixed(1)}
                  {ship.fuelReserve !== null && (
                    <span style={{ fontSize: '9px', color: 'var(--c-text-dim)' }}>
                      {' '}+{ship.fuelReserve.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            )}
            {ship.maxCargo > 0 && (
              <div>
                <div className="nav-cell-label">Cargo</div>
                <div style={{ fontSize: '13px', color: 'var(--c-text)', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
                  {ship.cargo}/{ship.maxCargo}<span className="nav-cell-unit">t</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ArwesPanel>
  )
}
