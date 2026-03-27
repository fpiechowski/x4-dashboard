# Workflow: Prepare Task

## Use this when

- The user wants to start work on the next task.
- The user specifies a task to work on.
- A task must be selected and prepared for implementation.

## Workflow

1. Select task.
- Use the user-specified task when provided.
- Otherwise read `ROADMAP.md` and prefer the nearest release milestone.
2. Check implementation readiness.
- Goal clarity
- Scope boundaries
- Testable acceptance criteria
- Dependencies and blockers
3. If task is not ready, run `refine-task`.
4. Build implementation brief.
- Issue number and title
- Goal and scope
- Acceptance criteria
- Affected files/systems
- Validation expectations
5. Return brief for implementation handoff.

## Guardrails

- Do not start implementation code here.
- Report blockers clearly if no viable task exists.
