---
name: feature-intake-to-roadmap
description: Turn a rough feature idea into roadmap and GitHub planning updates for x4-dashboard.
---

# Feature Intake To Roadmap

## Use this when

- The user proposes a new feature, improvement, or planning idea.
- The idea should be reflected in `ROADMAP.md`, GitHub issues, or milestone planning.

## Workflow

1. Check whether the request is already specific enough to plan.
   - If not, load `guided-interview` and close the key gaps first.
2. Read the relevant roadmap section and inspect related GitHub issues.
3. Decide where the idea belongs:
   - current milestone if it is small, urgent, and aligned
   - later milestone if it is valuable but not next
   - future vision if it is too large or premature
4. Prefer updating an existing issue before creating a new one.
5. When creating or rewriting an issue, make it implementation-ready:
   - clear summary
   - `Goal`
   - `Scope`
   - `Why`
   - milestone assignment when one clearly fits
6. Update `ROADMAP.md` if the planning picture changed.
7. If you changed local planning or config files, create a local Conventional Commit without asking.

## Output

- What changed in the roadmap
- Which issues were updated or created
- Which milestone now owns the work, or why none does yet

## Guardrails

- Do not write implementation code here.
- Do not create releases, tags, or close milestones unless the user explicitly asks.
