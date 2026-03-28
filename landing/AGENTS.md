# AGENTS.md

Landing-specific guidance for the public project site.

## Scope

- `landing/` is the public marketing and onboarding site for the project.
- It is separate from the main dashboard UI in `client/`.
- Keep landing work focused on project presentation, downloads, guides, screenshots, and public-facing copy.

## Stack And Boundaries

- Use React + TypeScript + Vite inside `landing/`.
- Keep landing code self-contained within `landing/src/` and `landing/public/` when practical.
- Do not import runtime dashboard code from `client/` just to share implementation details.

## Deployment

- The landing page deploys through Dokploy, backed by `Dockerfile.landing`.
- Do not reintroduce GitHub Pages or Pages-specific workflow assumptions unless the user explicitly asks.
- Treat Dokploy access, endpoints, and secrets as environment-local configuration, not repository data.

## Conventions

- Preserve the established visual language of the landing site unless the task is intentionally a redesign.
- Keep copy concise and public-facing.
- Prefer straightforward content sections over dashboard-specific abstractions.

## Validation

- Run `npm run typecheck:landing` after TypeScript changes in this module.
- Run `npm run build:landing` for meaningful landing deployment or rendering changes when practical.
