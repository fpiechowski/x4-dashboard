---
name: close-or-update-issue-after-delivery
description: Update or close GitHub issues after implementation work lands so task state does not go stale.
---

# Close Or Update Issue After Delivery

## Use this when

- Technical work has just been completed.
- A developer handoff indicates an issue should be updated or closed.
- The user asks to finish the planning/admin side after implementation.

## Workflow

1. Identify the relevant GitHub issue or issues from user context, recent commits, or current discussion.
2. Review the delivered work at a high level:
   - what changed
   - what validation ran
   - whether any follow-up remains
3. Update the issue with a concise delivery note.
   - mention the implemented outcome
   - mention validation that passed or what still needs checking
   - link follow-up work if the result is partial
4. Close the issue when the accepted scope is clearly complete.
5. Keep the issue open and narrow the remaining scope when the work is only partial.
6. If delivery changed the roadmap picture, follow with `roadmap-issue-sync`.

## Output

- Which issues were updated or closed
- What completion state was recorded
- Any follow-up issue or roadmap action that still remains

## Guardrails

- Do not close issues optimistically if key acceptance is still missing.
- Do not close milestones or create releases unless the user explicitly asks.
