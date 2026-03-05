import React, { useState } from 'react'
import { AnimatorGeneralProvider, Animator, GridLines, Dots } from '@arwes/react'
import { useGameData } from './hooks/useGameData'
import { Dashboard } from './components/Dashboard'
import { KeyBindingsModal } from './components/KeyBindingsModal'

const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:3001`

function getInitialDashboard(): string {
  return new URLSearchParams(window.location.search).get('dashboard') ?? 'full'
}

export function App() {
  const { state, wsConnected, pressKey } = useGameData(WS_URL)
  const [showBindings, setShowBindings] = useState(false)
  const [dashboardId, setDashboardId] = useState(getInitialDashboard)

  function handleChangeDashboard(id: string) {
    const url = new URL(window.location.href)
    url.searchParams.set('dashboard', id)
    window.history.pushState({}, '', url)
    setDashboardId(id)
  }

  return (
    <AnimatorGeneralProvider
      duration={{ enter: 0.5, exit: 0.3, stagger: 0.05 }}
    >
      <Animator active combine manager="stagger">
        {/* Ambient background effects */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <GridLines
            lineColor="hsl(191deg 100% 50% / 4%)"
            distance={40}
          />
          <Dots
            color="hsl(191deg 100% 50% / 10%)"
            distance={40}
            size={1}
          />
        </div>

        {/* Main dashboard content */}
        <div style={{ position: 'relative', zIndex: 1, height: '100vh' }}>
          <Dashboard
            state={state}
            wsConnected={wsConnected}
            dashboardId={dashboardId}
            onKeyPress={pressKey}
            onOpenSettings={() => setShowBindings(true)}
            onChangeDashboard={handleChangeDashboard}
          />
        </div>

        {showBindings && (
          <KeyBindingsModal
            onClose={() => setShowBindings(false)}
            onTestKey={pressKey}
          />
        )}
      </Animator>
    </AnimatorGeneralProvider>
  )
}
