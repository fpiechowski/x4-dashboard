---
name: release
description: Assess x4-dashboard release readiness, maintain release-facing docs, and publish a release when explicitly requested. Use when Codex needs release hygiene, artifact preparation, or GitHub release handling rather than deployment implementation.
---

# Release

## Workflow

1. Read only the release context needed for the request:
   - `RELEASE.md`
   - `CHANGELOG.md`
   - the relevant section of `ROADMAP.md`
   - relevant issue or milestone context when needed
2. Determine the mode:
   - readiness review
   - preparation work
   - explicit publication request
3. For readiness work, report blockers, missing validation, and release confidence.
4. For preparation work, update the release-facing docs and issue state that materially affect release quality.
5. For explicit publication work, run the most relevant release validation and report the resulting artifacts or public actions.

## Guardrails

- Do not treat deployment work as release work; operational changes belong to `deploy`.
- Do not push, tag, or publish a release unless the user explicitly asks.
- Keep release notes grounded in `CHANGELOG.md` and current project state.
