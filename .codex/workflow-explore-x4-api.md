# Workflow: Explore X4 API

## Use this when

- Implementing new widget extraction from X4: Foundations.
- Discovering or validating Lua/FFI API calls.

## Discovery order

1. Existing bridge widgets in `game-mods/x4_dashboard_bridge/ui/widgets/`
2. Related open-source repositories or forum references
3. In-game runtime exploration with guarded logging

## Standard approach

1. Search existing widget patterns first.
2. Prefer Lua helper APIs before adding FFI declarations.
3. For new FFI declarations use guarded registration with `pcall`.
4. Validate incrementally with targeted logging.
5. Clean up exploratory logs before final delivery.

## Guardrails

- Do not assume function availability without evidence.
- Match existing Lua style and defensive patterns.
