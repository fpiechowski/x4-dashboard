# Workflow: Ship Next

Use this for end-to-end task delivery from planning to verification.

## Delivery loop

1. Prepare task.
- Use `prepare-task`
- Use `refine-task` when needed
2. Implement.
- Use `implement-task`
- Create local commit only
3. Verify.
- Use `verify-task`
- Return `pass`, `fail`, or `blocked`
4. If `fail`, iterate implementation and verification until `pass` or `blocked`.
5. If `pass`, present acceptance scenarios to the user.
6. Close issue and push only after explicit user approval.
7. Report complete delivery summary.

## Stop conditions

- No viable task available
- Hard blocker that cannot be resolved safely
