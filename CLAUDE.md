# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run install:all   # Install all dependencies (server + client)
npm run dev           # Development: Node server (3001) + Vite (3000) with hot-reload
npm run mock          # Preview without game: mock data at http://localhost:3001
npm run build         # Compile React → server/public/ (needed before npm start)
npm start             # Production: Node server serves built client at port 3001
```

There are no tests and no linter configured.

## Architecture

This is a single Node.js application (`server/`) that serves a built React frontend (`server/public/`). In dev mode, Vite runs separately on port 3000 and proxies `/api` to port 3001.

**Data flow:**
1. X4 Lua mod (`game-mods/mycu_external_app/`) POSTs game state JSON to `POST /api/data` on every tick
2. `server/index.js` receives the POST, strips X4 color codes via `server/utils/normalizeData.js`, feeds data to the aggregator, and broadcasts via WebSocket
3. `server/dataAggregator.js` builds unified state — partial updates are merged so ship-only ticks don't wipe mission/logbook data
4. `client/src/hooks/useGameData.ts` receives WebSocket messages and provides `state`, `wsConnected`, and `pressKey(action)` to React components
5. Clicking a System Flag button calls `pressKey(action)` → `POST /api/keypress` → `server/keyPresser.js` → PowerShell `SendKeys` (Windows) or `xdotool` (Linux) → key reaches X4

**Mock mode** (`npm run mock` or `node server/index.js --mock`) bypasses the Lua mod and uses `server/mockData.js`, which generates an evolving simulated game state.

## Game State Model

All frontend types are in `client/src/types/gameData.ts`. The unified `GameState` has these top-level fields:

| Field | Type | Source |
|-------|------|--------|
| `_meta` | `ConnectionMeta` | Server (timestamp, externalConnected) |
| `player` | `PlayerInfo` | `playerProfile` widget (name, faction, credits, sector, sectorOwner) |
| `ship` | `ShipStatus` | `shipStatus` widget (name, type, hull, shields, isDockedOrLanded) |
| `flight` | `FlightState` | `shipStatus` widget (speed, maxSpeed, boostEnergy, boosting, travelDrive, flightAssist, seta) |
| `combat` | `CombatState` | Reserved — target always null currently |
| `missionOffers` | `MissionOffers \| null` | `mission_offers` widget |
| `activeMission` | `ActiveMission \| null` | `active_mission` widget |
| `logbook` | `{ list: LogbookEntry[] } \| null` | `logbook` widget |
| `currentResearch` | `CurrentResearch \| null` | `current_research` widget |
| `factions` | `Record \| null` | `factions` widget |
| `agents` | `any[] \| null` | `agents` widget |
| `inventory` | `Record \| null` | `inventory` widget |
| `transactionLog` | `{ list: any[] } \| null` | `transaction_log` widget |

When adding new data fields, update both the TypeScript interface in `gameData.ts` **and** the `getState()` output in `server/dataAggregator.js`.

## Server Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |

## Key Bindings

Stored in `server/config/keybindings.json`. Format (Windows SendKeys notation): `{F1}`–`{F12}`, `^a` (Ctrl+A), `+a` (Shift+A), `%a` (Alt+A), `{ENTER}`, `{ESC}`, `{SPACE}`, arrow keys.

## Arwes UI Patterns

The frontend uses `@arwes/react` v1.0.0-next.25020502 — a sci-fi animation framework with specific constraints:

- **Never use React strict mode** (breaks Arwes animations)
- All `<Text>` components must have a parent `<Animator>` node
- Reusable panel wrapper: `client/src/components/ArwesPanel.tsx` — use this for all new panels; it handles `FrameCorners` border, glow, color themes (`primary`/`danger`/`success`/`warning`/`purple`), and animated titles
- Frame pattern requires two nested divs: `<div style={{position:'relative'}}><FrameCorners .../><div style={{position:'relative'}}>content</div></div>`
- CSS variables for frame styling: `--arwes-frames-line-color`, `--arwes-frames-bg-color`, `--arwes-frames-line-filter`

## TypeScript

`tsconfig.json` sets `strict: false`. Run `npx tsc --noEmit` inside `client/` to check for type errors.

## Adding a New System Flag / Key Binding

1. Add the action key to `server/config/keybindings.json`
2. Add an entry to `FLAG_CONFIG` in `client/src/components/SystemFlags.tsx` with the matching `key` from `FlightState`
3. Add the field to `FlightState` in `client/src/types/gameData.ts` if it doesn't exist
4. Map the field in `server/dataAggregator.js` `getState()` from `ext.shipStatus.*`

## Lua Mod

The mod lives in `game-mods/mycu_external_app/`. To deploy, copy the folder to your X4 extensions directory. Key config:

- `ui/config.lua` — sets `host = 'localhost'`, `port = 3001`
- `ui/widgets/ship_status.lua` — exposes hull, shields, speed, maxSpeed, boosting, travelMode, flightAssist, boostEnergy, docked, seta, shipSize, ship name
- Each widget POSTs its data independently; the aggregator merges partial updates
