# Workflow: Release

## Use this when

- The user asks for release readiness, release preparation, or release publishing.

## Workflow

1. Read release context on demand.
- `RELEASE.md`
- `CHANGELOG.md`
- relevant `ROADMAP.md` section
2. Inspect local and GitHub state relevant to release confidence.
3. Select mode.
- Readiness audit
- Preparation
- Full publish (only when explicitly requested)
4. For readiness audits, provide concrete checklist and blockers.
5. For preparation, update release artifacts and docs.
6. For full publish, run release steps in controlled order and report results.

## Guardrails

- Do not push, tag, publish, or close milestones without explicit user approval.
- Do not mark release-ready when core validation is missing.
