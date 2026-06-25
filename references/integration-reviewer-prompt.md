# Integration Reviewer Prompt Template

Use this template when the magic-orchestrator agent dispatches a periodic
integration check after every N tasks (default N=3). The reviewer checks that
the seams between tasks are still intact — interfaces align, earlier tests
still pass, build is green.

**Purpose:** Catch integration bugs early (after 3 tasks) rather than late
(at the final review). Cheaper than a full final review, catches seam bugs
before more tasks build on top of them.

The controller passes the commit range so the reviewer sees exactly what has
changed across all tasks so far.

```
Task tool (general):
  description: "Integration check after Task N"
  prompt: |
    You are reviewing the integration health of an implementation in progress.

    ## Task Range

    BASE_SHA: [commit SHA before the first task]
    HEAD_SHA: [current commit SHA, after task N]

    ## What to Review

    Review the cumulative changes across all tasks:
    `git diff <BASE_SHA>..<HEAD_SHA>`

    Unlike a per-task code quality review, you are checking the SEAMS between
    tasks — not any single task's quality.

    ## Integration Checklist

    **Interface alignment:**
    - Do the interfaces between tasks still line up? (types, function
      signatures, method names, imports)
    - Did a later task change a return type, parameter name, or API contract
      that an earlier task depends on?
    - Are all imports valid? (no importing from a file that doesn't exist or
      exporting a name that doesn't match)

    **Earlier tests still pass:**
    - Run the test suite (or the relevant subset). Do tests from earlier
      tasks still pass?
    - If a test from Task 2 breaks after Task 5, that's an integration bug —
      flag it.

    **Build green:**
    - Does the project build/typecheck/lint successfully?
    - If there's a build step, run it.

    **Cumulative scope:**
    - Has the implementation drifted from the plan across tasks? (minor drift
      is OK, major drift is a flag)

    ## You are READ-ONLY

    This is review, not fixing. Do NOT edit, write, or mutate any file. Use
    `read`, `grep`, `glob`, read-only bash (`git diff`, `git log`, test
    runs, build commands).

    ## Report Format

    Return:

    - **Verdict:** PASS | FAIL
    - **Interface alignment:** OK | BROKEN (list which interfaces)
    - **Tests:** PASS | FAIL (list which tests fail)
    - **Build:** GREEN | BROKEN (error message)
    - **Issues found:** (if any, with file:line references and which tasks
      are involved)
    - **Recommendation:** proceed | stop and fix (with specific fix target)
```

## Notes for the controller (magic-orchestrator agent)

- Dispatch this after every N tasks (N from the plan header, default 3).
- Pass the BASE_SHA from before the FIRST task and the current HEAD_SHA.
- If the verdict is FAIL, STOP execution. Route to /magic-debug for targeted
  fix at the seam. Do not proceed to the next task until integration is
  restored.
- If the verdict is PASS, continue to the next task.
- Record the integration check result in state.json under `integration_checks`.
