# Workflow: Implement Task

## Use this when

- A concrete implementation task is defined.
- Expected output is code, configuration, docs, or release-support changes in this repository.

## Workflow

1. Start from concrete task context.
2. Read `AGENTS.md` and only relevant files.
3. Implement the smallest coherent change that satisfies the task.
4. Run practical validation.
- TypeScript changes: `npm run typecheck`
- Packaging/release changes: relevant release command from `AGENTS.md`
5. Create a local Conventional Commit at a meaningful checkpoint.
6. Do not push.
7. Report changed files, validation result, and retest guidance.

## Guardrails

- Do not push without explicit user approval.
- Do not rewrite history unless explicitly requested.
- Do not revert unrelated local changes.
