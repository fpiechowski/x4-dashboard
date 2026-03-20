import React from 'react'
import { FactionStanding } from '../types/gameData'
import { WidgetStateNotice } from './WidgetStateNotice'

interface Props {
  factions: FactionStanding[] | null
  dataState: 'loading' | 'offline' | 'ready'
}

function getRelationTone(faction: FactionStanding): 'positive' | 'neutral' | 'negative' | 'unknown' {
  if (typeof faction.relationValue === 'number') {
    if (faction.relationValue >= 10) return 'positive'
    if (faction.relationValue <= -10) return 'negative'
    return 'neutral'
  }

  const label = (faction.relationLabel || '').toLowerCase()

  if (label === 'ally' || label === 'friend') return 'positive'
  if (label === 'enemy' || label === 'hostile') return 'negative'
  if (label === 'neutral') return 'neutral'
  return 'unknown'
}

function formatRelationValue(value: number | null): string | null {
  if (value === null) return null
  return `${value > 0 ? '+' : ''}${value}`
}

export function Factions({ factions, dataState }: Props) {
  if (dataState === 'loading') {
    return <WidgetStateNotice tone="loading" title="Syncing faction standings" detail="Waiting for diplomacy telemetry from the bridge." />
  }

  if (dataState === 'offline') {
    return <WidgetStateNotice tone="offline" title="Faction standings offline" detail="Reconnect to inspect live reputation and licence data." />
  }

  if (!factions || factions.length === 0) {
    return <WidgetStateNotice tone="empty" title="No faction standings" detail="Faction telemetry appears here when the bridge provides standings data." compact />
  }

  return (
    <div className="factions-list">
      {factions.map((faction) => {
        const relationValue = formatRelationValue(faction.relationValue)
        const relationTone = getRelationTone(faction)
        const shortName = faction.shortName && faction.shortName !== faction.name ? faction.shortName : null
        const name = faction.name || 'Unknown Faction'
        const relationLabel = faction.relationLabel || 'Unknown'
        const licenses = faction.licenseLabels || []

        return (
          <div key={faction.id || name} className="faction-card">
            <div className="faction-card-header">
              <div>
                <div className="faction-name">{name}</div>
                {shortName && <div className="faction-short-name">{shortName}</div>}
              </div>
              <div className={`faction-relation faction-relation-${relationTone}`}>
                <span>{relationLabel}</span>
                {relationValue && <strong>{relationValue}</strong>}
              </div>
            </div>

            {licenses.length > 0 && (
              <div className="faction-license-row">
                <span className="faction-license-label">Licences</span>
                <div className="faction-license-chips">
                  {licenses.map((license) => (
                    <span key={`${faction.id}-${license}`} className="faction-license-chip">{license}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
