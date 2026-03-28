---
name: refine
description: Prioritize and refine x4-dashboard work into an implementation-ready brief or issue update. Use when Codex needs to pick the best next task from the current roadmap or issues, or when an issue ID or issue URL already identifies the task and it needs scope, acceptance criteria, dependencies, and validation details clarified.
---

# Refine

## Workflow

1. Determine the mode from the input:
   - If an issue ID or issue URL is provided, refine that exact task and skip re-prioritization.
   - If no task is specified, select the best next task from the current milestone and issue state.
2. Read only the repo areas, roadmap entries, and issue details needed to understand the task.
3. Close the implementation gaps:
   - clarify goal
   - define scope and non-goals
   - add observable acceptance criteria
   - call out dependencies, rollout notes, and validation expectations when they matter
4. Prefer updating the existing issue or planning artifact instead of creating duplicates.
5. Return an implementation-ready brief that `implement` can execute with minimal follow-up.

## Output

- The task chosen or refined
- Why it is the right task when selection was required
- Goal, scope, non-goals, acceptance criteria, and validation expectations
- Any remaining blocker that still prevents implementation

## Guardrails

- Do not start implementation code.
- Do not ask broad product questions when repo context can answer them.
- If the task is already implementation-ready, say so and avoid churn.
