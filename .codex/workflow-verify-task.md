# Workflow: Verify Task

## Use this when

- Implementation is complete and needs independent verification.
- The goal is a clear delivery gate: `pass`, `fail`, or `blocked`.

## Workflow

1. Start from implementation brief and delivery notes.
2. Select the lightest realistic runtime mode.
- Usually `npm run dev:mock`, `npm run dev`, `npm run serve`, or `npm start`
3. Run manual-style verification.
- Cover core acceptance criteria
- Check obvious regressions around delivered scope
4. Decide and report explicit outcome.
5. For `fail`, provide repro steps and expected vs actual behavior.
6. For `blocked`, provide exact blocker and unblocking condition.
7. For `pass`, return acceptance scenarios for user validation.

## Guardrails

- Do not implement fixes in this workflow.
- Stop testing once outcome is clear.
