# X4 Foundations Dashboard

A real-time cockpit dashboard for X4: Foundations built with React + [Arwes](https://arwes.dev/) sci-fi UI framework.

Game data is pushed directly from a custom Lua mod — no external tools or middleware required.

## Features

- **Ship Status** — hull and shield bars with color-coded health levels
- **Navigation** — sector name, speed graph (bar or arc gauge), boost energy, travel drive indicator
- **System Flags** — clickable buttons for Flight Assist, SETA, Travel Drive, Boost with live on/off state
- **Configurable key bindings** — each system button triggers a configurable key press sent to the game window
- **Target info** — target hull/shields and faction details
- **Mission Offers** — grouped by type (plot / guild / coalition / other), expandable
- **Active Mission** — current mission name, reward, and time remaining
- **Comms / Logbook** — in-game logbook events
- **Research tracker** — current research progress and resource requirements
- **Connection status** — live indicators for WebSocket and game data stream

## Quick Start — Preview with Mock Data

No game required:

```bash
npm run mock
```

Open **http://localhost:3001** in your browser. Mock mode generates an evolving game state: fluctuating hull/shields, changing speed, periodic combat events, missions, logbook, and research.

---

## Architecture

One Node.js application. The `client/` folder is React source that compiles into `server/public/` and is served by the same server.

```
┌──────────────────────────────────────────────────┐
│  Node.js server (server/index.js, port 3001)      │
│                                                   │
│  POST /api/data  ← X4 Lua mod pushes on each tick │
│  WebSocket       → pushes state to browser        │
│  POST /api/keypress ← browser → key sent to game  │
│  Static files    → serves built React frontend    │
└──────────────────────────────────────────────────┘
         ▲ serves          ▲ WebSocket
         │                 │
   browser opens      dashboard UI
   localhost:3001     (React/Arwes)
```

**Data flow:**
1. X4 Lua mod POSTs JSON game state to `POST /api/data` on every tick
2. Server strips X4 color codes (`server/utils/normalizeData.js`), feeds to aggregator
3. `server/dataAggregator.js` merges partial updates into unified state (ship-only ticks don't wipe mission data)
4. State broadcast via WebSocket to all connected browser clients
5. Browser clicks → `POST /api/keypress` → PowerShell `SendKeys` (Windows) or `xdotool` (Linux) → key reaches X4

---

## Setup

### Prerequisites

- Node.js v18+
- X4: Foundations

### Install

```bash
npm run install:all
```

### Run — Mock preview (no game needed)

```bash
npm run mock
# open http://localhost:3001
```

### Run — With real game

```bash
npm run build    # compile React → server/public/ (once after source changes)
npm start        # start server on port 3001
# open http://localhost:3001
```

### Run — Development (hot-reload)

```bash
npm run dev
# Node server on port 3001, Vite on port 3000
# open http://localhost:3000
```

---

## Lua Mod Setup

The custom Lua mod lives in `game-mods/mycu_external_app/`. Copy the folder to your X4 extensions directory:

```
X4 Foundations/extensions/mycu_external_app/
```

The mod POSTs game state directly to `http://localhost:3001/api/data` on every game tick. No additional software is needed — just the dashboard server and the mod.

Configuration is in `game-mods/mycu_external_app/ui/config.lua`:

```lua
host = 'localhost'
port = 3001
```

---

## Configuration

### Key Bindings

Click **⎔ KEY BINDINGS** in the dashboard header to configure which key each system button triggers.

Bindings are stored in `server/config/keybindings.json`.

**Key format** (Windows SendKeys notation):

| Format | Example | Meaning |
|--------|---------|---------|
| Function keys | `{F1}` – `{F12}` | F1 through F12 |
| Regular keys | `a`, `1` | Letters and digits |
| Special keys | `{ENTER}`, `{ESC}`, `{SPACE}` | Special keys |
| Arrow keys | `{UP}`, `{DOWN}`, `{LEFT}`, `{RIGHT}` | Arrow keys |
| Ctrl | `^a` | Ctrl+A |
| Shift | `+a` | Shift+A |
| Alt | `%a` | Alt+A |
| Combo | `^+{F1}` | Ctrl+Shift+F1 |

**How it works:** Clicking a button sends `POST /api/keypress` to the backend, which uses PowerShell `SendKeys` (Windows) or `xdotool` (Linux) to simulate the key press on the host machine. The game must be the foreground window or in borderless windowed mode to receive the key.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |

---

## Project Structure

```
x4-dashboard/
├── server/                   Node.js backend
│   ├── index.js              Express + WebSocket server, POST /api/data receiver
│   ├── dataAggregator.js     Merges Lua widget data into unified GameState
│   ├── keyPresser.js         Key press simulation (PowerShell / xdotool)
│   ├── mockData.js           Simulated game state for development
│   ├── utils/
│   │   └── normalizeData.js  Strips X4 color codes from game strings
│   └── config/
│       └── keybindings.json  User-configurable key bindings
├── client/                   React frontend (Vite + TypeScript)
│   └── src/
│       ├── App.tsx
│       ├── dashboards.ts         Dashboard/panel/widget layout config
│       ├── types/gameData.ts     All TypeScript interfaces for game state
│       ├── hooks/useGameData.ts  WebSocket connection + key press API
│       └── components/
│           ├── Dashboard.tsx         Layout engine (grid / columns)
│           ├── ArwesPanel.tsx        Reusable sci-fi panel wrapper
│           ├── PlayerInfo.tsx        Name, faction, credits, sector
│           ├── ShipStatus.tsx        Hull + shield bars
│           ├── Navigation.tsx        Speed graph, sector, travel drive
│           ├── SystemFlags.tsx       Clickable system toggle buttons
│           ├── TargetInfo.tsx        Target hull/shields/faction
│           ├── MissionOffers.tsx     Available missions list
│           ├── ActiveMission.tsx     Current active mission
│           ├── Comms.tsx             Logbook entries
│           ├── Research.tsx          Research progress
│           └── KeyBindingsModal.tsx  Key binding configuration UI
└── game-mods/
    └── mycu_external_app/    Custom X4 Lua mod
        └── ui/
            ├── config.lua    host/port configuration
            └── widgets/      One file per data widget (ship_status, logbook, etc.)
```
