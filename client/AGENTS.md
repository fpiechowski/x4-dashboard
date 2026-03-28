# AGENTS.md

Client-specific guidance for the main dashboard frontend.

## Scope

- `client/` is the browser dashboard UI, not the public marketing site.
- Keep `landing/` concerns out of this module.

## Stack And Boundaries

- Use ESM with `.ts` and `.tsx`.
- Follow the existing Vite + React + Arwes patterns already present in the dashboard.
- Shared game-state types belong in `client/src/types/gameData.ts`.
- Dashboard configuration belongs in `client/src/dashboards.ts`.
- Widget registration belongs in `client/src/components/dashboard/widgetRegistry.tsx`.
- Layout helpers belong in `client/src/components/dashboard/DashboardLayouts.tsx`.

## Conventions

- Functional components only.
- Prefer named exports; do not introduce default exports.
- Prefer `interface` for object shapes instead of `type` aliases or `enum`s when an interface fits.
- Use `T | null` instead of `T | undefined` for nullable client state.
- `client/tsconfig.json` uses `strict: false`; do not tighten it casually.
- Keep `Props` interfaces directly above the component that uses them.
- Match surrounding import style and ordering.
- Remove unused imports.
- Keep components focused and move reusable logic into hooks or utilities when it improves clarity.

## Arwes And Styling

- Never enable React StrictMode; it breaks Arwes animations.
- Use `client/src/components/ArwesPanel.tsx` for framed dashboard panels.
- Widget components render content; panel chrome belongs in `ArwesPanel`.
- Every Arwes `<Text>` must have a parent `<Animator>`.
- Available panel colors are `primary`, `danger`, `success`, `warning`, and `purple`.
- Global CSS lives in `client/src/index.css`; do not introduce CSS modules.
- Prefer CSS classes for static states and inline styles for computed values.

## Validation

- Run `npm run typecheck` after TypeScript changes in this module.
