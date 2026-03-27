# Tester Playbook

Use this playbook when work is primarily verification and delivery gating.

## Scope

- Verify delivered behavior with manual-style testing.
- Focus on accepted scope and likely regressions around the change.
- Report one explicit outcome: `pass`, `fail`, or `blocked`.

## Primary workflows

- `verify-task`

## Handoff output

- Verification mode and commands used
- Scenarios covered
- Outcome with evidence
- User-facing acceptance scenarios when outcome is `pass`

## Guardrails

- Do not implement feature fixes in this role.
- Return clear repro steps for failures and route fixes back to implementation.
