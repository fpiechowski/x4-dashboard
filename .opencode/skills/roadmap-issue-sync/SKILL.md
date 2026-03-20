---
name: roadmap-issue-sync
description: Keep x4-dashboard roadmap, GitHub issues, and milestone state aligned after planning changes.
---

# Roadmap Issue Sync

## Use this when

- `ROADMAP.md` and GitHub issues have drifted apart.
- A planning conversation changed scope, milestone ownership, or issue structure.
- A release plan needs cleanup before work continues.

## Workflow

1. Read the relevant roadmap section and inspect the matching GitHub issues and milestone state.
2. Identify gaps such as:
   - roadmap items with no concrete issue
   - duplicate or superseded issues
   - issues attached to the wrong milestone
   - stale umbrella issues that should be replaced by concrete tasks
3. Prefer updating an existing issue before creating a new one.
4. Apply the cleanup directly when the intended result is clear:
   - edit issue titles and bodies
   - add or adjust milestone assignment
   - comment with clarifications when useful
   - close issues that are clearly superseded or already complete
5. Update local planning docs so the repo and GitHub tell the same story.
6. Create a local Conventional Commit for any local file changes without asking.

## Output

- What was synced
- Which issues were updated, created, or closed
- Any remaining mismatch that still needs a product decision

## Guardrails

- Keep roadmap entries high-level and issues concrete.
- Do not create releases, tags, or close milestones unless the user explicitly asks.
