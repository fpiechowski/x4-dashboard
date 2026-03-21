import React from 'react'

interface Props {
  alertLevel: number      // 1 = alert (orange), 2 = combat (red)
  attackerCount: number
  incomingMissiles: number
  missileIncoming: boolean
  missileLockingOn: boolean
}

export function UnderAttackAlert({ alertLevel, attackerCount, incomingMissiles, missileIncoming, missileLockingOn }: Props) {
  const hasIncomingMissile = missileIncoming || incomingMissiles > 0
  const hasMissileLock = missileLockingOn && !hasIncomingMissile
  const isCombat = alertLevel >= 2 || hasIncomingMissile
  const modifier = isCombat ? 'combat' : 'alert'
  const missileLabel = hasIncomingMissile ? 'MISSILE INCOMING' : hasMissileLock ? 'LOCKING ON' : null

  return (
    <div className={`under-attack-alert under-attack-alert--${modifier}`} role="alert">
      <span className="under-attack-icon">{isCombat ? '▲' : '!'}</span>
      <span className="under-attack-text">
        {isCombat ? 'UNDER ATTACK' : 'ALERT'}
      </span>
      {attackerCount > 0 && (
        <span className="under-attack-count">
          {attackerCount} {attackerCount === 1 ? 'ATTACKER' : 'ATTACKERS'}
        </span>
      )}
      {missileLabel && (
        <span className="under-attack-missile">
          ⟫ {missileLabel} ⟫
        </span>
      )}
      <span className="under-attack-icon">{isCombat ? '▲' : '!'}</span>
    </div>
  )
}
