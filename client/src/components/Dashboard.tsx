import React from 'react'
import { Animator, Text } from '@arwes/react'
import { GameState } from '../types/gameData'
import { DASHBOARDS, getDashboard, WidgetId, GridDashboard, ColumnsDashboard } from '../dashboards'
import { UnderAttackAlert } from './UnderAttackAlert'
import { PlayerInfo } from './PlayerInfo'
import { ShipStatus } from './ShipStatus'
import { TargetInfo } from './TargetInfo'
import { Navigation } from './Navigation'
import { SystemFlags } from './SystemFlags'
import { MissionOffers } from './MissionOffers'
import { ActiveMission } from './ActiveMission'
import { Comms } from './Comms'
import { Research } from './Research'

interface Props {
  state: GameState
  wsConnected: boolean
  dashboardId: string
  onKeyPress: (action: string) => void
  onOpenSettings: () => void
  onChangeDashboard: (id: string) => void
}

function renderWidget(
  id: WidgetId,
  state: GameState,
  onKeyPress: (action: string) => void,
): React.ReactNode {
  switch (id) {
    case 'PlayerInfo':    return <PlayerInfo player={state.player} ship={state.ship} />
    case 'ShipStatus':    return <ShipStatus ship={state.ship} />
    case 'TargetInfo':    return state.combat.target ? <TargetInfo target={state.combat.target} /> : null
    case 'Navigation':    return <Navigation nav={state.navigation} ship={state.ship} systems={state.systems} />
    case 'SystemFlags':   return <SystemFlags systems={state.systems} onKeyPress={onKeyPress} />
    case 'ActiveMission': return <ActiveMission mission={state.activeMission} />
    case 'MissionOffers': return <MissionOffers offers={state.missionOffers} />
    case 'Comms':         return <Comms comms={state.comms} logbook={state.logbook} />
    case 'Research':      return <Research research={state.currentResearch} />
    case 'UnderAttack':   return state.combat.underAttack ? <UnderAttackAlert attackType={state.combat.attackType} /> : null
  }
}

interface LayoutProps {
  state: GameState
  onKeyPress: (action: string) => void
}

function GridLayout({ config, state, onKeyPress }: LayoutProps & { config: GridDashboard }) {
  return (
    <div
      className="dashboard-grid"
      style={{ gridTemplateColumns: config.columns }}
    >
      {config.widgets.map(w => {
        const content = renderWidget(w.id, state, onKeyPress)
        if (content === null) return null
        return (
          <div
            key={w.id}
            className="dashboard-grid-cell"
            style={{
              gridColumn: w.colSpan ? `${w.col} / span ${w.colSpan}` : w.col,
              gridRow:    w.rowSpan ? `${w.row} / span ${w.rowSpan}` : w.row,
              ...(w.scale && w.scale !== 1 ? { zoom: w.scale } : {}),
              ...(w.grow ? { alignSelf: 'stretch' } : {}),
              ...(w.height ? { height: w.height } : {}),
            }}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}

function ColumnsLayout({ config, state, onKeyPress }: LayoutProps & { config: ColumnsDashboard }) {
  return (
    <div className="dashboard-columns">
      {config.columns.map((col, colIdx) => (
        <div
          key={colIdx}
          className="dashboard-column"
          style={col.width ? { width: col.width, flexShrink: 0 } : { flex: 1 }}
        >
          {col.widgets.map(w => {
            const content = renderWidget(w.id, state, onKeyPress)
            if (content === null) return null
            return (
              <div
                key={w.id}
                className="dashboard-grid-cell"
                style={{
                  ...(w.scale && w.scale !== 1 ? { zoom: w.scale } : {}),
                  ...(w.grow ? { flex: 1, minHeight: 0 } : {}),
                  ...(w.height ? { height: w.height } : {}),
                }}
              >
                {content}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function Dashboard({ state, wsConnected, dashboardId, onKeyPress, onOpenSettings, onChangeDashboard }: Props) {
  const { _meta, ship } = state
  const config = getDashboard(dashboardId)

  return (
    <div className="dashboard">
      {/* ── Header ─────────────────────────────── */}
      <header className="dashboard-header">
        <Animator>
          <Text
            as="div"
            manager="decipher"
            fixed
            contentStyle={{ fontFamily: "'Exo 2', sans-serif" }}
            className="header-logo"
          >
            X4 FOUNDATIONS · COMMAND INTERFACE
          </Text>
        </Animator>

        <div className="header-right">
          <div className={`conn-badge ${wsConnected ? 'active' : 'inactive'}`}>
            <span className="conn-dot" />
            {wsConnected ? 'LIVE' : 'OFFLINE'}
          </div>
          {_meta.externalConnected && (
            <div className="conn-badge active">
              <span className="conn-dot" />
              EXT APP
            </div>
          )}
          {_meta.simpitConnected && (
            <div className="conn-badge active">
              <span className="conn-dot" />
              SIMPIT
            </div>
          )}

          {/* ── Dashboard selector ── */}
          <select
            className="dashboard-selector"
            value={dashboardId}
            onChange={e => onChangeDashboard(e.target.value)}
          >
            {DASHBOARDS.map(d => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>

          <button className="header-settings-btn" onClick={onOpenSettings}>
            ⎔ KEY BINDINGS
          </button>
        </div>
      </header>

      {/* ── Docked/Landed banner — full width, conditional ── */}
      {ship.isDockedOrLanded && (
        <div className="docked-banner">
          {ship.landingGearDown ? '⊟ DOCKED' : '▼ LANDED'}
          {state.docked?.stationName && ` · ${state.docked.stationName}`}
        </div>
      )}

      {/* ── Config-driven layout ────────────────── */}
      {config.layout === 'grid'
        ? <GridLayout config={config} state={state} onKeyPress={onKeyPress} />
        : <ColumnsLayout config={config} state={state} onKeyPress={onKeyPress} />
      }
    </div>
  )
}
