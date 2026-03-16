import React, { useEffect, useState } from 'react'
import { FlightState, KeyBinding, KeyBindings } from '../types/gameData'

interface Props {
  flight: FlightState
  onKeyPress: (action: string) => void
}

const FLAG_CONFIG: Array<{
  key?: keyof FlightState
  action: string
  icon: string
  label: string
  stateless?: boolean
}> = [
  { key: 'flightAssist', action: 'flightAssist', icon: '⊳', label: 'Flight Assist' },
  { key: 'seta',         action: 'seta',          icon: '≫', label: 'SETA' },
  { key: 'travelDrive',  action: 'travelDrive',   icon: '△', label: 'Travel Drive' },
  { action: 'autopilot', icon: '◈', label: 'Autopilot', stateless: true },
]

export function SystemFlags({ flight, onKeyPress }: Props) {
  const [bindings, setBindings] = useState<Record<string, KeyBinding>>({})
  const [pressing, setPressing] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/keybindings')
      .then(r => r.json())
      .then((data: KeyBindings) => setBindings(data.bindings || {}))
      .catch(() => {})
  }, [])

  function handlePress(action: string) {
    if (!bindings[action]) return

    setPressing(action)
    onKeyPress(action)
    setTimeout(() => setPressing(null), 200)
  }

  return (
    <>
      <div className="sysflags-grid">
        {FLAG_CONFIG.map(({ key, action, icon, label, stateless }) => {
          const isOn = key ? !!flight[key] : false
          const binding = bindings[action]
          const isPressed = pressing === action
          const stateLabel = stateless ? '◌ CMD' : isOn ? '● ON' : '○ OFF'

          return (
            <button
              key={action}
              className={`sysflag-btn ${isOn ? 'on' : 'off'} ${!binding ? 'no-binding' : ''}`}
              onClick={() => handlePress(action)}
              disabled={!binding}
              title={
                binding
                  ? `${label}: ${stateless ? 'COMMAND' : isOn ? 'ON' : 'OFF'} — Press: ${binding.key}`
                  : `${label}: No key binding. Configure in ⎔ KEY BINDINGS.`
              }
              style={isPressed ? { transform: 'scale(0.92)', opacity: 0.65 } : undefined}
            >
              <span className="sysflag-icon">{icon}</span>
              <span className="sysflag-name">{label}</span>
              <span className={`sysflag-state ${!stateless && isOn ? 'state-on' : 'state-off'}`}>
                {stateLabel}
              </span>
              {binding && (
                <span className="sysflag-key">{binding.key}</span>
              )}
            </button>
          )
        })}
      </div>

      <div style={{
        marginTop: '8px', fontSize: '9px', color: 'var(--c-text-dim)',
        letterSpacing: '1px', opacity: 0.55, lineHeight: 1.5,
      }}>
        Click to toggle · Keys sent to active game window · Configure via ⎔ KEY BINDINGS
      </div>
    </>
  )
}
