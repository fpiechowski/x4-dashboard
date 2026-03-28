---
name: implement
description: Implement a concrete x4-dashboard task from an issue, issue URL, or implementation brief. Use when Codex needs to change code, config, docs, workflows, or packaging and prepare a clean handoff for verification.
---

# Implement

## Workflow

1. Start from the concrete task context:
   - prefer an issue ID, issue URL, or implementation-ready brief
   - if the task is still under-specified, send it back to `refine` instead of inventing product scope
2. Read the root `AGENTS.md`, the nearest module `AGENTS.md`, and only the source files needed for the task.
3. Make the smallest coherent change that satisfies the request.
4. Run the most relevant validation when practical.
5. Leave a concise handoff for `tester`:
   - what changed
   - what to re-test
   - any setup details, mock-mode notes, or known caveats

## Validation Hints

- Dashboard TypeScript changes: `npm run typecheck`
- Landing TypeScript changes: `npm run typecheck:landing`
- Server aggregation or normalization logic: `npm test`
- Packaging or release changes: the most relevant release command from `AGENTS.md`

## Guardrails

- Do not take over roadmap management or routine issue triage.
- Do not push, tag, or publish unless the user explicitly asks.
- Work around unrelated local changes; do not revert them.
