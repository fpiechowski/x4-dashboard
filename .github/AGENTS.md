# AGENTS.md

Automation-specific guidance for GitHub repository metadata and workflows.

## Scope

- `.github/` owns CI, release automation, issue templates, and PR templates.
- Keep workflow changes deterministic and repository-scoped.

## Active Automation

- `ci.yml` and `release.yml` are the active GitHub Actions workflows.
- `pages.yml` is legacy and should stay removed unless the user explicitly asks to restore a Pages-based deployment.
- Dokploy deployment is managed outside GitHub Actions unless the user explicitly asks to move or mirror that logic into GitHub workflows.

## Conventions

- Avoid embedding secrets, tokens, local endpoints, or developer-specific MCP configuration in workflow files.
- Keep CI focused on reproducible validation and packaging steps.
- Preserve the existing release contract for published artifacts unless the task explicitly changes it.
- Update issue and PR templates carefully; they affect contributor-facing UX.
