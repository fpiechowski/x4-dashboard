# X4 Foundations Dashboard

A real-time cockpit dashboard for X4: Foundations built with React + [Arwes](https://arwes.dev/) sci-fi framework.

## Data Sources

| Source | What it provides |
|--------|-----------------|
| [X4 External App](https://github.com/mycumycu/X4-External-App) | Player profile, missions, logbook, factions, research, agents, inventory |
| [X4 Simpit](https://github.com/bekopharm/x4-simpit) | Ship hull/shields, navigation, combat alerts, system flags, comms |

The dashboard merges both sources — overlapping data (player name, credits, sector) uses X4 External App as the primary source with Simpit as fallback.

## Features

- **Ship Status panel** — large hull and shield bars with color-coded health levels
- **Under Attack alert** — full-width red flashing banner with attack type (missile / unknown)
- **System Flags** — clickable toggle buttons (Flight Assist, SETA, Autopilot, Travel Drive, Weapons, Landing Gear, Lights, Boost, Silent Running)
- **Configurable key bindings** — each system button can trigger a configurable key press on the server host, so clicking in the browser sends the key to the game
- **Navigation panel** — sector, speed, heading compass, legal status
- **Target lock panel** — target hull/shields + faction/legal/distance info
- **Mission Offers** (left column) — grouped by type, expandable with description
- **Active Mission** — current mission with reward and time remaining
- **Comms / Logbook** (right column) — in-game messages and logbook events
- **Research tracker** — current research progress and resource requirements
- **Connection status** — live indicators for WebSocket, X4 External App, and Simpit

## Quick Start — Preview with Mock Data

No game required. Just run:

```bash
npm run mock
```

Then open **http://localhost:3001** in your browser.

The mock mode generates a realistic evolving game state:
- Ship hull/shields that take damage during periodic combat events (every 45s)
- Speed, heading, and boost energy that change over time
- A flashing "UNDER ATTACK — MISSILE" alert every 45 seconds
- Mock missions, research progress, logbook entries, comms
- Credits slowly increasing (simulated mining income)

---

## Architecture

This is **one Node.js application** (`server/`). The `client/` folder is just the React source code — it gets compiled into `server/public/` and served by the same server.

```
┌─────────────────────────────────────────────┐
│  Node.js server (server/index.js, port 3001) │
│                                             │
│  • Serves static frontend (server/public/)  │
│  • WebSocket → pushes data to browser       │
│  • REST API → key press commands            │
│  • Polls X4 External App every 1s           │
│  • Reads X4 Simpit named pipe               │
└─────────────────────────────────────────────┘
         ▲ serves           ▲ WebSocket
         │                  │
   browser opens       dashboard UI
   localhost:3001      (React/Arwes)
```

The `client/` folder only exists to hold the React/TypeScript source. In development you run both the Vite dev server (for hot-reloading) and the Node server simultaneously. In production, you build once and run only the Node server.

---

## Setup

### Prerequisites

- Node.js v18+
- X4: Foundations with:
  - [X4 External App](https://github.com/mycumycu/X4-External-App) (provides REST API on `localhost:8080`)
  - [X4 Simpit](https://github.com/bekopharm/x4-simpit) (optional, provides real-time flight data via named pipe)
  - On Windows: [X4_Python_Pipe_Server](https://github.com/SirNukes/X4-Python-Pipe-Server) if using Simpit

### Install

```bash
npm run install:all
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

### Run — Mock preview (no game needed)

```bash
npm run mock
# → opens http://localhost:3001 with fake evolving data
```

### Run — With real game (production)

```bash
npm run build    # compile React → server/public/ (only needed once after changes)
npm start        # start Node server — serves dashboard + connects to game
# → open http://localhost:3001
```

### Run — Development (hot-reload)

```bash
npm run dev
# starts both: Node server (port 3001) + Vite dev server (port 3000)
# → open http://localhost:3000 for hot-reloading
```

## Configuration

### Environment Variables (server)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `X4_EXTERNAL_URL` | `http://localhost:8080` | X4 External App URL |
| `SIMPIT_PIPE` | `\\.\pipe\x4simpit_out` | X4 Simpit named pipe path |

### Key Bindings

Click the **⚙ KEY BINDINGS** button in the header to configure which key each system button triggers.

Bindings are stored in `server/config/keybindings.json`.

**Key format** (Windows SendKeys notation):
- `{F1}` through `{F12}` — function keys
- `a` through `z`, `0` through `9` — regular keys
- `{ENTER}`, `{ESC}`, `{SPACE}`, `{TAB}` — special keys
- `{UP}`, `{DOWN}`, `{LEFT}`, `{RIGHT}` — arrow keys
- `^a` — Ctrl+A
- `+a` — Shift+A
- `%a` — Alt+A
- `^+{F1}` — Ctrl+Shift+F1

**How it works:** When you click a system button in the browser, it sends a `POST /api/keypress` request to the backend server. The server uses PowerShell `SendKeys` (Windows) or `xdotool` (Linux) to simulate the key press on the host machine. The game must be in the foreground (or use borderless windowed mode on a secondary screen) to receive the key press.

**Recommended setup:** Run X4 in borderless windowed mode on your main screen, and open the dashboard on a secondary screen or tablet/phone. This way you can click buttons and they'll go to X4.

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  X4 FOUNDATIONS · COMMAND INTERFACE            [LIVE] [EXT] [⚙]    │
├──────────────────── UNDER ATTACK ── ⚠ MISSILE ⚠ ────────────────────┤ (conditional)
│                     │                         │                     │
│  ACTIVE MISSION     │  COMMANDER NAME         │  RESEARCH           │
│                     │  Faction · Credits      │  Progress bar       │
│  MISSION OFFERS     │  ⌖ Sector               │                     │
│                     │                         │  COMMS / LOGBOOK    │
│  ■ Plot missions    │  ◈ SHIELDS ████ 85%     │                     │
│  ■ Guild missions   │  ◆ HULL    ████ 92%     │  Messages from game │
│  ■ Other missions   │  ⚡ Boost  ████ 60%     │  and NPC comms      │
│                     │                         │                     │
│                     │  TARGET LOCK            │                     │
│                     │  Target shields/hull    │                     │
│                     │                         │                     │
│                     │  ◈ NAVIGATION           │                     │
│                     │  Sector / Speed / HDG   │                     │
│                     │                         │                     │
│                     │  ⚙ SYSTEMS              │                     │
│                     │  [FLIGHT ASSIST] [SETA] │                     │
│                     │  [AUTOPILOT] [WEAPONS]  │                     │
└─────────────────────┴─────────────────────────┴─────────────────────┘
```

## Architecture

```
x4-dashboard/
├── server/               Node.js backend
│   ├── index.js          Express + WebSocket server
│   ├── x4ExternalApp.js  Polls X4 External App REST API every 1s
│   ├── simpitReader.js   Reads from X4 Simpit named pipe
│   ├── dataAggregator.js Merges both sources into unified state
│   ├── keyPresser.js     Key press simulation (PowerShell/xdotool)
│   └── config/
│       └── keybindings.json  User-configurable key bindings
└── client/               React frontend (Vite + TypeScript)
    └── src/
        ├── App.tsx
        ├── hooks/useGameData.ts    WebSocket connection + key press API
        └── components/
            ├── Dashboard.tsx       Main 3-column layout
            ├── UnderAttackAlert    Red flashing alert banner
            ├── PlayerInfo          Commander name, faction, credits, sector
            ├── ShipStatus          Hull + shield bars (most prominent)
            ├── TargetInfo          Target hull/shields/faction
            ├── Navigation          Speed, heading, sector
            ├── SystemFlags         Clickable system toggle buttons
            ├── MissionOffers       Left column — available missions
            ├── ActiveMission       Current active mission
            ├── Comms               Right column — comms + logbook
            ├── Research            Research progress
            └── KeyBindingsModal    Key binding configuration UI
```
