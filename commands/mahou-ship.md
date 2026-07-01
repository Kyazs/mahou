---
description: "Push branch, create PR with auto-generated body, filter .mahou/ artifacts"
argument-hint: "[spec uuid or feature name from ROADMAP]"
tools:
  read: true
  bash: true
  grep: true
  glob: true
---

<objective>
Ship completed work: push the branch, create a PR with an auto-generated
body sourced from the spec, plan, state, and verification report. Filter
.mahou/ planning artifacts from the PR diff so reviewers see only code
changes.
</objective>

<context>
Target: $ARGUMENTS (spec UUID, feature name from ROADMAP, or empty for
current branch)
</context>

<when_to_use>
Use after /mahou-verify returns PASS. This is the final step in the feature
build cycle.

If verification hasn't passed, tell the user to run /mahou-verify first.
</when_to_use>

<process>
### Phase 1: Inspect Current State

1. `git status` — check working tree is clean (or note uncommitted changes)
2. `git log --oneline -20` — see recent commits
3. `git rev-parse --abbrev-ref HEAD` — current branch name
4. `git rev-parse --abbrev-ref @{upstream}` or `git remote` — check remote
   tracking

If there's nothing to ship (clean tree, no commits ahead of remote), tell the
user and stop.

### Phase 2: Gather PR Body Content

Read the following (if they exist) to build the PR body:

1. **Spec** (`./.mahou/specs/<uuid>.md`) — extract the goal and key design
   decisions
2. **Plan** (`./.mahou/plans/<uuid>.md`) — extract task count and names
3. **state.json** (`./.mahou/state.json`) — extract completed task count,
   commit SHAs, review loop counts, any concerns
4. **Verify report** (`./.mahou/verify/<uuid>.md`) — extract verification
   verdict and evidence

If $ARGUMENTS is a UUID, use it to find the files. If it's a feature name,
look it up in ROADMAP.md. If empty, try to infer from state.json or recent
commits.

### Phase 3: Generate PR Body

Construct the PR body:

```markdown
## Summary

[Spec goal — one sentence]

## What Changed

[Task count] tasks completed:
- Task 1: [name]
- Task 2: [name]
- ...

## Verification

[Verification verdict: PASS]
[Evidence summary from verify report]

## Test Plan

- [ ] [Key behavioral test from verify report]
- [ ] [Edge case test]
- [ ] [Manual verification step if any UNCLEAR criteria]

## Notes

[Any concerns from state.json, any advisory notes from verify report]
```

### Phase 4: Filter .mahou/ Artifacts

When creating the PR, ensure `.mahou/` directory contents are not included
in the PR diff. These are planning artifacts, not code.

Check if `.mahou/` is in `.gitignore`. If not, note this to the user —
they may want to add it. The PR should still be created; the filtering is
about what reviewers see, not what's committed.

### Phase 5: Push and Create PR

1. `git push -u origin <branch-name>` (if not already pushed)
2. Check if a PR already exists:
   `gh pr list --head <branch-name> --json number,url`
3. If no PR exists:
   Save the PR body to a temp file, then:
   `gh pr create --title "<type>: <description>" --body-file <temp-file>`
4. If a PR exists:
   Update the PR body:
   `gh pr edit <number> --body-file <temp-file>`
5. Clean up the temp file.

### Phase 6: Present Results

Present to the user:
- PR URL (from gh output)
- PR title and body summary
- Merge/cleanup options:
  - "Merge the PR when ready: `gh pr merge <number>`"
  - "Squash and merge: `gh pr merge <number> --squash`"
  - "Delete local branch after merge: `git branch -d <branch-name>`"

### Phase 7: Update ROADMAP

Update ROADMAP.md: feature status → `done`.
</process>

<error_handling>
- **Nothing to ship:** `git status` shows clean tree and no commits ahead of
  remote. Tell the user "nothing to ship."
- **`gh` CLI not installed:** Detect by running `gh --version`. If it fails,
  tell the user to install GitHub CLI. Provide the manual commands:
  `git push -u origin <branch>` and instructions to create the PR manually
  via GitHub web UI. Save the PR body to `./.mahou/pr-body.md` for
  copy-paste.
- **PR creation fails (auth, network):** Save the PR body to
  `./.mahou/pr-body.md` so the user can create the PR manually. Report the
  error.
- **PR already exists:** Update the existing PR's body instead of creating a
  new one.
- **Uncommitted changes in working tree:** Warn the user. Ask whether to
  commit them first or ship without them.
</error_handling>

<restrictions>
- You are read-only for source code: no `edit` or `write` tools. You may
  write to temp files (for PR body) and update ROADMAP.md via bash.
- Do NOT merge the PR yourself. Present the merge command and let the user
  decide.
- Do NOT force-push. If push fails due to remote changes, tell the user to
  pull and resolve first.
</restrictions>

<references>
@{{MAHOU_HOME}}/references/git-workflow.md
</references>
