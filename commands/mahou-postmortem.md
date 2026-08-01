---
description: "Write a post-mortem for a resolved incident — root cause, defense-in-depth, monitoring"
argument-hint: "[bug or incident description]"
agent: mahou-planner
model: opencode-go/deepseek-v4-pro
---

<objective>
Produce a post-mortem document for a resolved bug or incident. Captures the
root cause, the investigation trail, the fix, the defense-in-depth applied,
and the monitoring follow-ups — so the same class of bug is structurally
unlikely to recur.

Writes ONLY to `./.mahou/postmortems/<uuid>.md`. The codebase stays untouched.
</objective>

<context>
User's incident: $ARGUMENTS
</context>

<when_to_use>
Use after a bug is fixed and verified (typically after `/mahou-debug`), when
the user wants the learning preserved. Also use after production incidents or
flaky-test investigations.

If the bug isn't resolved yet, tell the user to run `/mahou-debug` first.
</when_to_use>

<process>
### Phase 1: Gather Context

Read what's available:

1. `git log --oneline -20` — the recent history around the fix.
2. `git show <fix-commit>` — the fix itself, if identifiable.
3. `./.mahou/verify/*.md` — any verification reports related to the fix.
4. Ask the user (one question at a time, multiple choice preferred) for
   anything not recoverable from git: timeline, impact, who was involved.

### Phase 2: Reconstruct the Investigation

From the fix and history, reconstruct:

- What the symptom was and how it was reproduced.
- Where the bad value/data originated (the root cause), tracing backward.
- The hypothesis that was tested, and what ruled alternatives out.
- What the minimal fix was and why it addresses the root cause.

Do not fabricate detail you cannot support from git history or the user's
answers. Mark unknowns as unknown.

### Phase 3: Write the Post-Mortem

Generate a UUID (`uuidgen`, `python -c "import uuid; print(uuid.uuid4())"`, or
`[guid]::NewGuid().ToString()`) and write to `./.mahou/postmortems/<uuid>.md`:

```markdown
# Post-Mortem: [short incident name]

**Date:** [date]
**Severity:** [P0-P3]
**Root cause:** [one sentence]
**Fix commit:** [sha]

## Timeline

- [time] [event]

## Symptom

[What users/tests observed]

## Root Cause Analysis

[Where the bad value originated, tracing backward. What was ruled out.]

## Fix

[The minimal fix, and why it addresses the root cause, not the symptom]

## Defense-in-Depth

[What validation/layers were added so the bug is structurally impossible]

## Monitoring / Follow-ups

- [ ] [alert or metric to add]
- [ ] [test or coverage gap to close]
- [ ] [docs to update]

## Lessons

[What the investigation revealed about the system or process]
```

### Phase 4: Present

Present the post-mortem path and a one-paragraph summary to the user. Ask if
they want follow-up items added to ROADMAP.md as tasks (run
/mahou-brainstorm for any that need design).
</process>

<error_handling>
- **Nothing recoverable from git:** State that clearly. Build the post-mortem
  from the user's account of the incident only.
- **Bug not resolved:** Tell the user to run /mahou-debug first.
- **Similar post-mortem exists:** Note the cross-reference rather than
  duplicating.
</error_handling>

<restrictions>
- The codebase is read-only. You may ONLY write to
  `./.mahou/postmortems/<uuid>.md`.
- Bash is read-only (git history, uuid generation).
- Do NOT propose or make code changes. Follow-ups are recorded, not executed.
</restrictions>
