# OpenCode to Codex Migration

This repository now uses a Codex-first setup.

## Why this migration exists

OpenCode used static per-agent definitions (`developer`, `tester`, `product-manager`) with permission profiles.
Codex works better with:

- one shared repository policy file (`AGENTS.md`)
- explicit workflow documents (`.codex/workflow-*.md`)
- lightweight role playbooks (`.codex/playbook-*.md`)
- optional, ad-hoc subagents when parallelization is useful

The goal is to preserve the same operating model without depending on static OpenCode agent configuration.

## Source and target mapping

- `.opencode/agents/*.md` -> `.codex/playbook-*.md`
- `.opencode/skills/*/SKILL.md` -> `.codex/workflow-*.md`
- `.opencode/commands/ship-next.md` -> `.codex/workflow-ship-next.md`
- global behavior rules -> `AGENTS.md` (single source of truth)

## Role model in Codex

- `developer` playbook: implementation delivery
- `tester` playbook: manual-style verification gate
- `product-manager` playbook: roadmap, issue, and release hygiene

Roles are workflow lenses, not persistent runtime identities.

## Workflow entry points

- `.codex/workflow-prepare-task.md`
- `.codex/workflow-implement-task.md`
- `.codex/workflow-verify-task.md`
- `.codex/workflow-refine-task.md`
- `.codex/workflow-feature-intake.md`
- `.codex/workflow-release.md`
- `.codex/workflow-explore-x4-api.md`
- `.codex/workflow-ship-next.md`

## Operational guidance

1. Start from user intent, then select the matching workflow.
2. Keep implementation and verification responsibilities separate.
3. Use local commits as checkpoints, but do not push without explicit user approval.
4. Keep roadmap and release docs synchronized with issue state.

## Transition status

- `AGENTS.md` is canonical.
- `.codex/` is canonical for workflow and role behavior.
- `.opencode/` is kept temporarily for reference and can be removed when no longer needed.
