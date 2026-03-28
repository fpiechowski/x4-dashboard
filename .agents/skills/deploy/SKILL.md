---
name: deploy
description: Handle x4-dashboard operational work such as CI or CD workflow changes, Dockerfile updates, Dokploy deploys, mock or landing deployment maintenance, packaging automation, and release-pipeline support. Use when the task is operational rather than product implementation.
---

# Deploy

## Workflow

1. Start from the concrete operational task context:
   - prefer an issue ID, issue URL, or explicit deployment objective
2. Identify the target system before making changes:
   - GitHub Actions CI or release automation
   - Dokploy landing deployment
   - Dokploy mock deployment
   - packaging or artifact generation
3. Read only the relevant automation files, Dockerfiles, docs, and release scripts.
4. Make the smallest coherent operational change.
5. Use Dokploy MCP when the task involves live Dokploy state and the tool is configured locally.
6. Report the deployment surface touched, the validation run, and any manual follow-up or rollback note.

## Guardrails

- Do not commit Dokploy secrets, MCP credentials, or local endpoints into the repository.
- Do not silently redefine the deployment target; anchor the work to the specified issue or explicit user goal.
- Do not use `release` as a substitute for deployment work; use `release` only for release readiness or publication flow.
