---
name: project-status-and-next-steps
description: Assess x4-dashboard status from roadmap, repo history, and GitHub issues, then recommend the next highest-value tasks.
---

# Project Status And Next Steps

## Use this when

- The user asks for project status.
- The user asks what should be built next.
- The user wants a concise planning view before delegating work to `developer`.

## Workflow

1. Read the minimum planning context needed, usually `ROADMAP.md` first.
2. Inspect the current project state:
   - recent local commits and working tree state
   - relevant open issues and milestone state on GitHub
   - recently closed work if it changes the current picture
3. Build a short status view:
   - current release focus
   - recently landed work
   - active or still-open work
   - blockers, stale items, or missing issue coverage
4. Recommend the next 1-3 tasks in priority order.
   - prefer the smallest high-value tasks that fit the current roadmap phase
   - explain why now, what they unlock, and any dependency or release risk
5. If roadmap and GitHub are out of sync, say so explicitly and follow up with `roadmap-issue-sync` when the user wants the cleanup done.

## Output

- A concise status summary
- A prioritized next-step list
- Any roadmap, milestone, or issue mismatch that needs cleanup

## Guardrails

- Default to reporting and recommending, not mutating project state.
- Do not create releases, tags, or close milestones unless the user explicitly asks.
