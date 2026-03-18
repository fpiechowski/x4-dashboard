import React, { useEffect, useRef } from 'react'
import { LogbookEntry } from '../types/gameData'

interface Props {
  logbook: { list: LogbookEntry[] } | null
}

function sanitize(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function Comms({ logbook }: Props) {
  const logbookEntries = logbook?.list || []
  const visibleEntries = logbookEntries.slice(-30)
  const hasLogbook = logbookEntries.length > 0
  const listRef = useRef<HTMLDivElement | null>(null)
  const shouldStickToBottomRef = useRef(true)

  function handleScroll() {
    if (!listRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    const distanceFromBottom = scrollHeight - clientHeight - scrollTop

    shouldStickToBottomRef.current = distanceFromBottom < 24
  }

  useEffect(() => {
    if (!listRef.current) return

    if (shouldStickToBottomRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [logbookEntries])

  return (
    <div ref={listRef} className="comms-list" onScroll={handleScroll}>
      {!hasLogbook && <div className="empty-state">No logbook entries</div>}
      {visibleEntries.map((entry, i) => (
        <div key={i} className="logbook-item">
          <div className="logbook-title">{sanitize(entry.title)}</div>
          {entry.factionname && (
            <div className="logbook-faction">{entry.factionname}</div>
          )}
          {entry.text && (
            <div className="logbook-text">
              {sanitize(entry.text).slice(0, 150)}{entry.text.length > 150 ? '…' : ''}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
