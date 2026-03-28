---
name: x4-api
description: Discover and use X4: Foundations Lua APIs and FFI bindings for the dashboard bridge mod. Use when Codex works in game-mods/x4_dashboard_bridge/ and needs new game data extraction, bridge widgets, unfamiliar game API calls, or troubleshooting around Lua bridge integration.
---

# X4 API

## Workflow

1. Start from the needed game data or bridge behavior.
2. Check existing widget implementations under `ui/widgets/` first; they are the primary API reference.
3. Search for nearby helper functions or FFI declarations before adding new ones.
4. Prefer existing Lua helper functions when they expose the needed data.
5. When FFI is required:
   - use `pcall(ffi.cdef, ...)`
   - wrap exploratory calls in `pcall(...)`
6. Use temporary `DebugError(...)` logging only while discovering behavior, then remove noisy debug output.
7. Report which API path or widget pattern was used so follow-up work stays consistent.

## Useful References

- `ui/widgets/ship_status.lua`
- `ui/widgets/inventory.lua`
- `ui/widgets/factions.lua`
- `ui/widgets/agents.lua`
- `ui/widgets/target_info.lua`
- `ui/widgets/player_profile.lua`

## Guardrails

- Do not assume a game API exists without checking existing patterns first.
- Keep bridge payload changes compatible with the server normalization and aggregation flow.
- Avoid speculative refactors in the bridge while doing API discovery.
