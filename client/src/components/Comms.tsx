import React from 'react'
import { LogbookEntry } from '../types/gameData'

interface Props {
  logbook: { list: LogbookEntry[] } | null
}

function sanitize(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function Comms({ logbook }: Props) {
  const logbookEntries = logbook?.list || []
  const hasLogbook = logbookEntries.length > 0

  return (
    <div className="comms-list">
      {!hasLogbook && <div className="empty-state">No logbook entries</div>}
      {logbookEntries.slice(0, 30).map((entry, i) => (
        <div key={i} className="logbook-item">
          <div className="logbook-title">{sanitize(entry.title)}</div>
          {entry.factionname && (
            <div className="logbook-faction">{entry.factionname}</div>
          )}
          {entry.text && (
            <div style={{ fontSize: '10px', color: 'var(--c-text-dim)', marginTop: '3px', lineHeight: '1.4' }}>
              {sanitize(entry.text).slice(0, 150)}{entry.text.length > 150 ? '…' : ''}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
