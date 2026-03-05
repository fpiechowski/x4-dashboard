import React from 'react'
import { CombatTarget } from '../types/gameData'
import { ArwesPanel } from './ArwesPanel'

interface Props {
  target: CombatTarget
}

function formatDist(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`
  return `${Math.round(m)} m`
}

export function TargetInfo({ target }: Props) {
  const hullPct    = Math.max(0, Math.min(100, target.hull))
  const shieldsPct = Math.max(0, Math.min(100, target.shields))

  return (
    <ArwesPanel
      title="Target Lock"
      titleIcon="◎"
      color={target.isHostile ? 'danger' : 'warning'}
    >
      {/* Scan animation overlay */}
      <div className="scan-overlay" />

      <div className="target-name">{target.name}</div>
      {target.shipName && <div className="target-ship">{target.shipName}</div>}

      {/* Target shields */}
      <div className="status-bar-group" style={{ marginBottom: '6px' }}>
        <div className="status-bar-header">
          <span className="status-bar-label" style={{ fontSize: '9px' }}>Target Shields</span>
          <span style={{ fontSize: '13px', color: 'var(--c-cyan)', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
            {shieldsPct.toFixed(0)}%
          </span>
        </div>
        <div className="status-bar-track" style={{ height: '12px' }}>
          <div className="status-bar-fill shields" style={{ width: `${shieldsPct}%` }} />
        </div>
      </div>

      {/* Target hull */}
      <div className="status-bar-group" style={{ marginBottom: '6px' }}>
        <div className="status-bar-header">
          <span className="status-bar-label" style={{ fontSize: '9px' }}>Target Hull</span>
          <span style={{
            fontSize: '13px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            color: hullPct > 60 ? 'var(--c-green)' :
                   hullPct > 30 ? 'var(--c-orange)' : 'var(--c-red)',
          }}>
            {hullPct.toFixed(0)}%
          </span>
        </div>
        <div className="status-bar-track" style={{ height: '12px' }}>
          <div
            className={`status-bar-fill hull ${hullPct > 60 ? '' : hullPct > 30 ? 'med' : 'low'}`}
            style={{ width: `${hullPct}%` }}
          />
        </div>
      </div>

      <div className="target-meta">
        {target.isHostile && <span className="target-badge hostile">HOSTILE</span>}
        {target.legalStatus && (
          <span className={`target-badge ${target.legalStatus.toLowerCase() === 'wanted' ? 'hostile' : 'neutral'}`}>
            {target.legalStatus}
          </span>
        )}
        {target.distance > 0 && (
          <span className="target-badge distance">{formatDist(target.distance)}</span>
        )}
        {target.combatRank && (
          <span className="target-badge rank">{target.combatRank}</span>
        )}
        {target.faction && (
          <span className="target-badge neutral">{target.faction}</span>
        )}
        {target.bounty > 0 && (
          <span className="target-badge hostile">
            BOUNTY {target.bounty.toLocaleString()} Cr
          </span>
        )}
      </div>
    </ArwesPanel>
  )
}
