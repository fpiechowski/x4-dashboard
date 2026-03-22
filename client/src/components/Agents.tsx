import React from 'react'
import { AgentEntry } from '../types/gameData'
import { WidgetStateNotice } from './WidgetStateNotice'

interface Props {
  agents: AgentEntry[] | null
  dataState: 'loading' | 'offline' | 'ready'
}

function getAgentMonogram(agent: AgentEntry): string {
  const source = agent.agent.name || 'Agent'
  const words = source.split(/\s+/).filter(Boolean)

  if (words.length >= 2) {
    return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

function getAssignmentLabel(agent: AgentEntry): string {
  const shipName = agent.agent.ship.name
  const prestige = agent.agent.ship.prestige

  if (shipName && prestige) return `${shipName} - ${prestige}`
  if (shipName) return shipName
  if (prestige) return prestige
  return 'Unassigned vessel'
}

function getMissionTone(agent: AgentEntry): 'active' | 'idle' {
  return agent.currentMission ? 'active' : 'idle'
}

export function Agents({ agents, dataState }: Props) {
  if (dataState === 'loading') {
    return <WidgetStateNotice tone="loading" title="Syncing diplomacy agents" detail="Waiting for the first agent assignments from the bridge." />
  }

  if (dataState === 'offline') {
    return <WidgetStateNotice tone="offline" title="Agents telemetry offline" detail="Reconnect to refresh assignments, mission risk, and remaining time." />
  }

  if (agents === null) {
    return <WidgetStateNotice tone="loading" title="Syncing diplomacy agents" detail="Waiting for the first agent assignments from the bridge." />
  }

  if (agents.length === 0) {
    return <WidgetStateNotice tone="empty" title="No diplomacy agents available" detail="Agents appear here when the bridge reports active diplomacy personnel." compact />
  }

  const activeAgents = agents.filter((entry) => entry.currentMission)
  const idleAgents = agents.length - activeAgents.length

  return (
    <div className="agents-widget">
      <div className="agents-summary-grid">
        <div className="agents-summary-card tone-active">
          <span className="agents-summary-label">Active</span>
          <strong>{activeAgents.length}</strong>
        </div>
        <div className="agents-summary-card tone-idle">
          <span className="agents-summary-label">Idle</span>
          <strong>{idleAgents}</strong>
        </div>
        <div className="agents-summary-card tone-total">
          <span className="agents-summary-label">Total</span>
          <strong>{agents.length}</strong>
        </div>
      </div>

      <div className="agents-card-list">
        {agents.map((entry) => {
          const mission = entry.currentMission
          const missionTone = getMissionTone(entry)
          const factionLabel = entry.agent.originFactionNameShort || entry.agent.originFactionName

          return (
            <div key={entry.agent.id} className={`agent-card agent-card-${missionTone}`}>
              <div className="agent-card-top">
                <div className={`agent-monogram agent-monogram-${missionTone}`}>{getAgentMonogram(entry)}</div>
                <div className="agent-heading">
                  <div className="agent-name">{entry.agent.name}</div>
                  <div className="agent-meta-row">
                    <span className="agent-rank">{entry.agent.rank}</span>
                    <span className="agent-faction">{factionLabel}</span>
                  </div>
                </div>
              </div>

              <div className="agent-skills-grid">
                <div className="agent-skill-chip">
                  <span>Neg</span>
                  <strong>{entry.agent.negotiationLevel}</strong>
                </div>
                <div className="agent-skill-chip">
                  <span>Esp</span>
                  <strong>{entry.agent.espionageLevel}</strong>
                </div>
              </div>

              <div className="agent-assignment-block">
                <div className="agent-block-label">Assignment</div>
                <div className="agent-assignment-value">{getAssignmentLabel(entry)}</div>
              </div>

              {mission ? (
                <div className="agent-mission-block">
                  <div className="agent-mission-header">
                    <span className="agent-mission-type">{mission.type}</span>
                    <span className="agent-mission-time">{mission.timeLeftText || 'In progress'}</span>
                  </div>
                  <div className="agent-mission-name">{mission.name}</div>
                  <div className="agent-mission-meta">
                    {mission.likelihoodOfSuccess && <span>{mission.likelihoodOfSuccess}</span>}
                    {mission.riskToAgent && <span>{mission.riskToAgent}</span>}
                    {mission.rewards && <span>{mission.rewards}</span>}
                  </div>
                  {mission.target && <div className="agent-mission-target">Target: {mission.target}</div>}
                </div>
              ) : (
                <div className="agent-idle-block">
                  <div className="agent-idle-title">Available</div>
                  <div className="agent-idle-detail">No active operation. Ready for a new diplomacy assignment.</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
