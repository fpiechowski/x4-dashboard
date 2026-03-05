import React from 'react'

interface Props {
  attackType: string | null
}

export function UnderAttackAlert({ attackType }: Props) {
  const isMissile = attackType?.toLowerCase().includes('missile')

  return (
    <div className="under-attack-alert" role="alert">
      <span className="attack-icon">{isMissile ? '⟫' : '▲'}</span>
      <span className="attack-text">UNDER ATTACK</span>
      {attackType && (
        <span className="attack-type">· {attackType.toUpperCase()} ·</span>
      )}
      <span className="attack-icon">{isMissile ? '⟫' : '▲'}</span>
    </div>
  )
}
