import React from 'react'

interface Props {
  missileIncoming: boolean
  missileLockingOn: boolean
}

export function UnderAttackAlert({ missileIncoming, missileLockingOn }: Props) {
  const warningState = missileIncoming
    ? {
        modifier: 'incoming',
        icon: '▲',
        label: 'MISSILE INCOMING',
      }
    : missileLockingOn
      ? {
          modifier: 'lock',
          icon: '!',
          label: 'MISSILE LOCK',
          detail: 'LOCK ACQUIRED',
        }
      : null

  if (!warningState) return null

  return (
    <div className={`under-attack-alert under-attack-alert--${warningState.modifier}`} role="alert">
      <span className="under-attack-icon">{warningState.icon}</span>
      <span className="under-attack-text">{warningState.label}</span>
      {warningState.detail && <span className="under-attack-missile">{warningState.detail}</span>}
      <span className="under-attack-icon">{warningState.icon}</span>
    </div>
  )
}
