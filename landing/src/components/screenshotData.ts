export interface Screenshot {
  src: string
  alt: string
  title: string
}

const BASE = './screenshots'

export const screenshots: Screenshot[] = [
  {
    src: `${BASE}/dashboard-flight-no-target.png`,
    alt: 'Flight dashboard without target using ARC speedometer',
    title: 'Flight (No Target)',
  },
  {
    src: `${BASE}/dashboard-flight-classic.png`,
    alt: 'Flight classic dashboard with target panel',
    title: 'Flight (Classic)',
  },
  {
    src: `${BASE}/dashboard-flight-combat-alert-target.png`,
    alt: 'Flight dashboard combat alert with active target',
    title: 'Flight Combat Alert',
  },
  {
    src: `${BASE}/dashboard-flight-combat-missile-inbound.png`,
    alt: 'Flight dashboard with missile inbound warning',
    title: 'Flight Missile Inbound',
  },
  {
    src: `${BASE}/dashboard-flight-speedometer-arc-boost-active.png`,
    alt: 'Flight dashboard with ARC speedometer and boost active',
    title: 'Speedometer ARC (Boost)',
  },
  {
    src: `${BASE}/dashboard-flight-speedometer-arc-travel-active.png`,
    alt: 'Flight dashboard with ARC speedometer and travel mode active',
    title: 'Speedometer ARC (Travel)',
  },
  {
    src: `${BASE}/dashboard-flight-speedometer-bar-boost-active.png`,
    alt: 'Flight dashboard with BAR speedometer and boost active',
    title: 'Speedometer BAR (Boost)',
  },
  {
    src: `${BASE}/dashboard-flight-speedometer-bar-travel-active.png`,
    alt: 'Flight dashboard with BAR speedometer and travel mode active',
    title: 'Speedometer BAR (Travel)',
  },
  {
    src: `${BASE}/dashboard-ship-controls.png`,
    alt: 'Ship controls dashboard',
    title: 'Ship Controls',
  },
  {
    src: `${BASE}/dashboard-target.png`,
    alt: 'Target dashboard view',
    title: 'Target',
  },
  {
    src: `${BASE}/dashboard-operations-overview.png`,
    alt: 'Operations overview dashboard',
    title: 'Operations Overview',
  },
  {
    src: `${BASE}/dashboard-operations-intel.png`,
    alt: 'Operations intel dashboard',
    title: 'Operations Intel',
  },
  {
    src: `${BASE}/dashboard-operations-missions.png`,
    alt: 'Operations missions dashboard',
    title: 'Operations Missions',
  },
  {
    src: `${BASE}/dashboard-operations-trade.png`,
    alt: 'Operations trade dashboard',
    title: 'Operations Trade',
  },
]
