---
description: "Resume work from previous session — state restoration with git-diff reconciliation"
tools:
  read: true
  bash: true
  grep: true
  glob: true
---

<objective>
Restore project context and resume work seamlessly from a previous session.
Reads state.json to find where the orchestrator left off, runs a git-diff
reconciliation to detect any manual changes, and routes back to the
orchestrator to continue.

This is the session-continuity command. Close opencode mid-orchestration,
reopen, run /magic-resume, and you're back where you left off.
</objective>

<process>
### Phase 1: Load State

1. Read `./.magic-pi/state.json`. If it doesn't exist:
   - Tell the user "no active orchestration found."
   - Suggest checking ROADMAP.md for project status: `read ./.magic-pi/ROADMAP.md`
   - Stop.

2. Parse state.json. Extract:
   - The plan path
   - The spec path
   - The task list with statuses
   - `last_known_good_sha`
   - Any concerns from the last session

3. Identify:
   - The last in-progress task (status: `in_progress`)
   - All completed tasks (status: `complete`)
   - All pending tasks (status: `pending`)
   - The BASE_SHA of the in-progress task

### Phase 2: Git-Diff Reconciliation

Run `git diff <last_known_good_sha>..HEAD --stat` to detect changes since the
last session.

**If the diff is clean (no changes):**
- Report "no manual changes detected since last session."
- Proceed to Phase 3.

**If the diff shows unexpected changes (user edited files manually):**
- Present the changed files to the user.
- Ask: "These files changed since the last session. Do you want to:
  (A) Incorporate these changes and continue (the orchestrator will work
      with the current state of the files)
  (B) Revert these changes and resume from the last known-good state
      (`git checkout <last_known_good_sha> -- <files>`)"
- Wait for the user's answer. Do NOT auto-resolve.

**If HEAD has moved backwards (someone did git reset):**
- Flag: "HEAD is behind last_known_good_sha. This means the git state was
  rewound. Do you want to continue from the current HEAD, or reset to
  last_known_good_sha?"
- Wait for the user's answer.

### Phase 3: Present Status

Present to the user:

```
## Session Resume: [feature name]

**Plan:** [plan path]
**Spec:** [spec path]

### Task Status

| # | Task | Status | Concerns |
|---|------|--------|----------|
| 1 | [name] | ✅ complete | — |
| 2 | [name] | ✅ complete | — |
| 3 | [name] | 🔄 in_progress | [concerns from last session] |
| 4 | [name] | ⏳ pending | — |

### Next Action

Resume orchestration from Task 3:
  /magic-orchestrator [plan path]

The orchestrator will read state.json and continue from the in-progress task.
```

### Phase 4: Route

Tell the user to run:

> `/magic-orchestrator [plan path]`

The orchestrator reads state.json, identifies the in-progress task, and
resumes from there (it doesn't restart from Task 1).
</process>

<error_handling>
- **state.json doesn't exist:** Tell user "no active orchestration found."
  Suggest checking ROADMAP.md.
- **state.json references a plan file that no longer exists:** Flag "plan file
  missing." Suggest re-running /magic-brainstorm or checking git history
  (`git log --oneline -- ./.magic-pi/plans/`).
- **state.json is invalid JSON:** Flag the parse error. Suggest checking the
  file or re-running the orchestrator (which will recreate state.json).
- **HEAD moved backwards:** Flag and ask user to confirm before proceeding.
  Don't auto-reset.
- **No in-progress task (all complete or all pending):** If all complete,
  suggest /magic-verify. If all pending, suggest /magic-orchestrator from
  the beginning.
</error_handling>

<restrictions>
- You are read-only: no `edit` or `write` tools. You may only read state,
  run git commands, and present status.
- Do NOT auto-resolve manual change conflicts. Always ask the user.
- Do NOT restart the orchestrator yourself. Route the user to run it.
</restrictions>
