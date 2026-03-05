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
1. `server/x4ExternalApp.js` polls `http://localhost:8080/api/data` every 1s (X4 External App mod)
2. `server/simpitReader.js` reads newline-delimited JSON from named pipe `\\.\pipe\x4simpit_out` (X4 Simpit mod)
3. `server/dataAggregator.js` merges both sources into a unified state — External App has precedence, Simpit is fallback for hull/shields/navigation
4. `server/index.js` broadcasts that state via WebSocket to all clients; also exposes REST endpoints for key presses and keybinding config
5. `client/src/hooks/useGameData.ts` receives WebSocket messages and provides `state`, `wsConnected`, and `pressKey(action)` to React components
6. Clicking a System Flag button calls `pressKey(action)` → `POST /api/keypress` → `server/keyPresser.js` → PowerShell `SendKeys` (Windows) or `xdotool` (Linux) → key reaches X4

**Mock mode** (`npm run mock` or `node server/index.js --mock`) bypasses both data sources and uses `server/mockData.js`, which generates an evolving simulated game state with periodic combat events.

## Server Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `X4_EXTERNAL_URL` | `http://localhost:8080` | X4 External App URL |
| `SIMPIT_PIPE` | `\\.\pipe\x4simpit_out` | Named pipe path |

## Key Bindings

Stored in `server/config/keybindings.json`. Format (Windows SendKeys notation): `{F1}`–`{F12}`, `^a` (Ctrl+A), `+a` (Shift+A), `%a` (Alt+A), `{ENTER}`, `{ESC}`, `{SPACE}`, arrow keys.

## Arwes UI Patterns

The frontend uses `@arwes/react` v1.0.0-next.25020502 — a sci-fi animation framework with specific constraints:

- **Never use React strict mode** (breaks Arwes animations)
- All `<Text>` components must have a parent `<Animator>` node
- Reusable panel wrapper: `client/src/components/ArwesPanel.tsx` — use this for all new panels; it handles `FrameLines` border, glow, color themes (`primary`/`danger`/`success`/`warning`/`purple`), and animated titles
- Frame pattern requires two nested divs: `<div style={{position:'relative'}}><FrameLines .../><div style={{position:'relative'}}>content</div></div>`
- CSS variables for frame styling: `--arwes-frames-line-color`, `--arwes-frames-bg-color`, `--arwes-frames-line-filter`

## TypeScript

All frontend types are defined in `client/src/types/gameData.ts`. `tsconfig.json` sets `strict: false`. When adding new data fields, update both the TypeScript interface and the aggregator output in `server/dataAggregator.js`.

## Adding a New System Flag / Key Binding

1. Add the action key to `server/config/keybindings.json`
2. Add the button to `client/src/components/SystemFlags.tsx` — follow the existing pattern (reads `state.systems.*`, calls `pressKey(action)`)
3. Add the corresponding field to `SystemFlags` interface in `client/src/types/gameData.ts`
4. Map the Simpit flag bit in `server/dataAggregator.js` `parseFlags()` if it comes from Simpit