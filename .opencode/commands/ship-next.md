---
description: Pick the next task, refine if needed, ship it, and close the issue if complete
agent: build
---

User constraint or override: $ARGUMENTS

Run the full delivery loop for `x4-dashboard`:

1. **Task preparation** - Call @product-manager to use `prepare-task` skill:
   - Select the best implementation-ready task (or use `$ARGUMENTS` to specify)
   - Refine if needed using `refine-task`
   - Return implementation brief to orchestrator

2. **Implementation** - Pass brief to @developer:
   - Tell @developer to use `implement-task` skill
   - Developer creates LOCAL commit only (no push)
   - Return implementation result to orchestrator

3. **Verification** - Pass implementation to @tester:
   - Tell @tester to use `verify-task` skill
   - Return explicit `pass`, `fail`, or `blocked` outcome
   - **When `pass`: also return acceptance test scenarios for user**

4. **Failure loop** - If @tester returns `fail`:
   - Pass failure report back to @developer
   - Repeat implementation → verification until `pass` or blocked
   - If blocked, inform user and explain the blocker

5. **Acceptance testing** - After @tester returns `pass`:
   - Present acceptance test scenarios from @tester to the user
   - Suggest user perform manual acceptance testing (optional)

6. **Issue closure** - Call @product-manager:
   - Ask user: "Should I close the GitHub issue?"
   - After approval, close the issue with delivery note
   - Update roadmap if needed
   - Ask user: "Should I push the changes to remote?"
   - After approval, execute `git push`

7. **Summary** - Report the complete delivery outcome.

Stop early only if no viable task exists or a blocker cannot be resolved.