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

function getRelationMeterFill(faction: FactionStanding): number {
  if (typeof faction.relationValue === 'number') {
    return Math.max(0, Math.min(100, ((faction.relationValue + 30) / 60) * 100))
  }

  const tone = getRelationTone(faction)
  if (tone === 'positive') return 78
  if (tone === 'negative') return 22
  if (tone === 'neutral') return 50
  return 50
}

function getFactionMonogram(faction: FactionStanding): string {
  const source = faction.shortName || faction.name || 'Faction'
  const alnum = source.replace(/[^A-Za-z0-9 ]+/g, ' ').trim()

  if (!alnum) return '??'

  const words = alnum.split(/\s+/).filter(Boolean)

  if (words.length >= 2) {
    return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase()
  }

  return alnum.slice(0, 2).toUpperCase()
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

  const summary = factions.reduce((totals, faction) => {
    const tone = getRelationTone(faction)

    if (tone === 'positive') totals.positive += 1
    else if (tone === 'negative') totals.negative += 1
    else if (tone === 'neutral') totals.neutral += 1
    else totals.unknown += 1

    if ((faction.licenseLabels || []).length > 0) totals.licensed += 1

    return totals
  }, { positive: 0, neutral: 0, negative: 0, unknown: 0, licensed: 0 })

  const sortedFactions = [...factions].sort((a, b) => {
    const aValue = typeof a.relationValue === 'number' ? a.relationValue : 0
    const bValue = typeof b.relationValue === 'number' ? b.relationValue : 0
    return bValue - aValue
  })

  return (
    <div className="factions-list">
      <div className="factions-summary-grid">
        <div className="factions-summary-card tone-positive">
          <span className="factions-summary-label">Allied</span>
          <strong>{summary.positive}</strong>
        </div>
        <div className="factions-summary-card tone-neutral">
          <span className="factions-summary-label">Neutral</span>
          <strong>{summary.neutral}</strong>
        </div>
        <div className="factions-summary-card tone-negative">
          <span className="factions-summary-label">Hostile</span>
          <strong>{summary.negative}</strong>
        </div>
        <div className="factions-summary-card tone-unknown">
          <span className="factions-summary-label">Licences</span>
          <strong>{summary.licensed}</strong>
        </div>
      </div>

      <div className="factions-card-grid">
        {sortedFactions.map((faction) => {
          const relationValue = formatRelationValue(faction.relationValue)
          const relationTone = getRelationTone(faction)
          const meterFill = getRelationMeterFill(faction)
          const shortName = faction.shortName && faction.shortName !== faction.name ? faction.shortName : null
          const name = faction.name || 'Unknown Faction'
          const relationLabel = faction.relationLabel || 'Unknown'
          const licenses = faction.licenseLabels || []
          const monogram = getFactionMonogram(faction)
          const signalValue = relationValue || relationLabel.slice(0, 3).toUpperCase()
          const licenseSummary = licenses.length > 0
            ? licenses.length === 1
              ? licenses[0]
              : `${licenses[0]} +${licenses.length - 1}`
            : 'No licences'

          return (
            <div key={faction.id || name} className={`faction-card faction-card-${relationTone}`}>
              <div className="faction-card-top">
                <div className={`faction-monogram faction-monogram-${relationTone}`}>{monogram}</div>
                <div className={`faction-card-signal faction-card-signal-${relationTone}`}>
                  <span>Rep</span>
                  <strong>{signalValue}</strong>
                </div>
              </div>

              <div className="faction-card-heading">
                <div className="faction-card-heading-main">
                  <div className="faction-name">{name}</div>
                  {shortName && <div className="faction-short-name">{shortName}</div>}
                </div>
              </div>

              <div className="faction-relation-meter" aria-hidden="true">
                <div className="faction-relation-meter-track">
                  <div className={`faction-relation-meter-fill faction-relation-meter-fill-${relationTone}`} style={{ width: `${meterFill}%` }} />
                </div>
              </div>

              <div className="faction-card-footer">
                <span className={`faction-relation-pill faction-relation-pill-${relationTone}`}>{relationLabel}</span>
                <span className={`faction-license-count${licenses.length ? '' : ' is-empty'}`}>{licenses.length} LIC</span>
              </div>

              <div className="faction-license-mini">{licenseSummary}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
