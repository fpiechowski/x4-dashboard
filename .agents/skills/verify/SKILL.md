---
name: verify
description: Verify delivered x4-dashboard work through focused manual-style checks, runtime smoke tests, or browser evidence. Use when implementation is complete and Codex needs to return pass, fail, or blocked plus user-facing acceptance scenarios.
---

# Verify

## Workflow

1. Start from the implementation brief or issue context plus the latest developer handoff.
2. Choose the lightest realistic verification mode for the delivered scope:
   - dashboard runtime flow
   - landing page flow
   - launcher flow
   - direct validation command when that is enough
3. Use Chrome DevTools MCP when browser inspection or interaction is the best fit and the tool is configured locally.
4. Stop as soon as the outcome is clear:
   - `pass`
   - `fail`
   - `blocked`
5. When the outcome is `pass`, prepare short acceptance scenarios for the user.

## Output

- Verification mode and commands used
- Explicit outcome
- Repro details for failures
- Acceptance scenarios for the user when verification passes

## Guardrails

- Do not implement fixes from this workflow.
- Do not expand into unrelated exploratory testing once the task outcome is already clear.
- Keep the result anchored to the specified issue, issue URL, or implementation brief.
