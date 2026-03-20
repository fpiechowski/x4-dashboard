---
name: release-readiness-and-publish
description: Assess release readiness, prepare release artifacts and notes, and publish a release for x4-dashboard when explicitly requested.
---

# Release Readiness And Publish

## Use this when

- The user asks whether a release is ready.
- The user asks to prepare a release.
- The user asks to publish a release.
- Changelog, milestone, and release execution need to be handled as one coordinated workflow.

## Workflow

1. Read the relevant release context on demand:
   - `RELEASE.md`
   - `CHANGELOG.md`
   - the relevant section of `ROADMAP.md`
2. Inspect the current state:
   - local git status and recent commits
   - relevant open and recently closed GitHub issues
   - milestone scope and whether unfinished work still blocks release confidence
3. Determine which mode applies:
   - readiness audit only
   - preparation only
   - full publish requested explicitly by the user
4. For readiness audits, produce a concrete checklist:
   - changelog completeness
   - release notes readiness
   - milestone and issue hygiene
   - validation still needed, such as `npm run release:check`, `npm run release:bundle`, or `npm run desktop:dist`
   - blocking risks or unfinished work
5. For preparation work, update the needed local artifacts:
   - `CHANGELOG.md`
   - `RELEASE.md` if the documented release process changed
   - roadmap or issues if the release picture needs cleanup
6. When local files change during preparation, create a local Conventional Commit without asking.
7. Only if the user explicitly asks to publish, execute the release actions in a controlled order:
   - confirm the intended version and release scope from the current context
   - run the most relevant validation commands that are practical
   - create the tag if requested
   - create or update the GitHub release notes from `CHANGELOG.md`
   - report the resulting tag, release URL, and any follow-up actions
8. After release work, update or close related issues when their state is now clear, and leave milestone closure to an explicit user request.

## Output

- A release readiness verdict or publish result
- Any blockers, missing validation, or documentation gaps
- What files or issues were updated
- What remains to do next, if anything

## Guardrails

- Do not push, tag, create a GitHub release, or close a milestone unless the user explicitly asks.
- Do not mark a release ready if important validation or scope confirmation is still missing.
- Prefer explicit release notes grounded in `CHANGELOG.md` over improvised summaries.
