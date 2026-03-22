import React from 'react'
import { InventoryData, InventoryItem } from '../types/gameData'
import { WidgetStateNotice } from './WidgetStateNotice'

const styles = {
  widget: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '8px',
  },
  summaryCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    padding: '7px 8px',
    border: '1px solid var(--c-border-dim)',
    background: 'linear-gradient(180deg, rgba(0, 18, 26, 0.85), rgba(0, 10, 16, 0.9))',
  },
  summaryLabel: {
    fontSize: '8px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--c-text-dim)',
  },
  summaryValue: {
    fontFamily: 'var(--font-ui)',
    fontSize: '15px',
    fontWeight: 600,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: '6px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '9px 10px',
    border: '1px solid rgba(0, 229, 255, 0.12)',
    background: 'linear-gradient(180deg, rgba(0, 22, 30, 0.9), rgba(0, 10, 16, 0.96))',
  },
  itemTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  itemMonogram: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    background: 'rgba(0, 12, 18, 0.42)',
    fontFamily: 'var(--font-ui)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1px',
    flexShrink: 0,
  },
  itemHeading: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    minWidth: 0,
    flex: 1,
  },
  itemName: {
    fontSize: '11px',
    color: 'var(--c-text-bright)',
    lineHeight: 1.25,
  },
  itemCategory: {
    fontSize: '8px',
    letterSpacing: '1.6px',
    textTransform: 'uppercase',
    color: 'var(--c-text-dim)',
  },
  itemAmount: {
    fontFamily: 'var(--font-ui)',
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--c-green)',
    whiteSpace: 'nowrap',
  },
  itemMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  itemPill: {
    padding: '2px 6px',
    background: 'rgba(255, 255, 255, 0.03)',
    fontSize: '8px',
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
  },
} as const

interface Props {
  inventory: InventoryData | null
  dataState: 'loading' | 'offline' | 'ready'
}

function getCategoryMonogram(item: InventoryItem): string {
  const source = item.category?.name || item.name || 'Item'
  const words = source.split(/\s+/).filter(Boolean)

  if (words.length >= 2) {
    return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

export function Inventory({ inventory, dataState }: Props) {
  if (dataState === 'loading') {
    return <WidgetStateNotice tone="loading" title="Syncing inventory manifest" detail="Waiting for the first personal inventory snapshot from the bridge." compact />
  }

  if (dataState === 'offline') {
    return <WidgetStateNotice tone="offline" title="Inventory telemetry offline" detail="Reconnect to inspect the current personal inventory manifest." compact />
  }

  if (inventory === null) {
    return <WidgetStateNotice tone="loading" title="Syncing inventory manifest" detail="Waiting for the first personal inventory snapshot from the bridge." compact />
  }

  if (!inventory.list.length) {
    return <WidgetStateNotice tone="empty" title="Inventory hold is clear" detail="Personal inventory items appear here when the bridge reports carried wares." compact />
  }

  const stackCount = inventory.list.length
  const totalUnits = inventory.list.reduce((sum, item) => sum + item.amount, 0)
  const flaggedItems = inventory.list.filter((item) => item.isIllegal).length

  return (
    <div style={styles.widget}>
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Stacks</span>
          <strong style={{ ...styles.summaryValue, color: 'var(--c-cyan)' }}>{stackCount}</strong>
        </div>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Units</span>
          <strong style={{ ...styles.summaryValue, color: 'var(--c-text-bright)' }}>{totalUnits.toLocaleString()}</strong>
        </div>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Flagged</span>
          <strong style={{ ...styles.summaryValue, color: 'var(--c-yellow)' }}>{flaggedItems}</strong>
        </div>
      </div>

      <div style={styles.list}>
        {inventory.list.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.item,
              borderColor: item.isIllegal ? 'rgba(255, 152, 0, 0.22)' : 'rgba(0, 229, 255, 0.12)',
            }}
          >
            <div style={styles.itemTop}>
              <div
                style={{
                  ...styles.itemMonogram,
                  border: `1px solid ${item.isIllegal ? 'var(--c-orange)' : 'var(--c-cyan)'}`,
                  color: item.isIllegal ? 'var(--c-orange)' : 'var(--c-cyan)',
                }}
              >
                {getCategoryMonogram(item)}
              </div>
              <div style={styles.itemHeading}>
                <div style={styles.itemName}>{item.name}</div>
                <div style={styles.itemCategory}>{item.category?.name || 'Uncategorised'}</div>
              </div>
              <div style={styles.itemAmount}>{item.amount.toLocaleString()}</div>
            </div>

            {item.isIllegal && (
              <div style={styles.itemMeta}>
                <span
                  style={{
                    ...styles.itemPill,
                    color: 'var(--c-orange)',
                    border: '1px solid rgba(255, 152, 0, 0.24)',
                  }}
                >
                  Contraband
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
