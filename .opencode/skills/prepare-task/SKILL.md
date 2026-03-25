---
name: prepare-task
description: Select and prepare a task for implementation - find the best next task, refine if needed, and create an implementation brief for the developer.
compatibility: opencode
---

# Prepare Task

## Use this when

- The user wants to start work on the next task.
- The user specifies a task to work on.
- You need to select, refine, and prepare a task for the developer.

## Workflow

1. **Select task**
   - If user specified a task (issue number, title, or identifier), find and select it
   - Otherwise, read `ROADMAP.md` and find the best next task from the current milestone
   - Prefer tasks from the nearest release milestone over future releases
   - Prefer concrete open GitHub issues over vague ideas

2. **Check implementation readiness**
   - Is the goal clear?
   - Is the scope defined?
   - Are acceptance criteria testable?
   - Are dependencies resolved?
   - If not ready, load `refine-task` to clarify

3. **Create implementation brief**
   - Issue number and title
   - Goal and scope
   - Acceptance criteria
   - Relevant files and systems
   - Validation expectations

4. **Return brief to parent agent**
   - Provide clear handoff instructions
   - Include any context the developer will need

## Output

- Selected task and why it was chosen
- Implementation brief for developer
- Handoff instructions for orchestrator

## Guardrails

- Do not call other subagents - return brief to parent instead.
- Do not start implementation - that belongs to `developer`.
- If no viable task exists, report the blocker clearly.