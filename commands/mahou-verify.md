---
description: "Verify implementation against spec — PASS, FIX_FORWARD, or REPLAN"
argument-hint: "[spec uuid or path to spec/plan]"
tools:
  read: true
  bash: true
  grep: true
  glob: true
  agent: true
---

<objective>
Verify that an implementation meets its spec. Dispatches verifier subagents
per UAT criterion, synthesizes their verdicts, and produces a routing
verdict that closes the workflow loop:

- PASS → proceed to /mahou-ship or /mahou-secure
- FIX_FORWARD → route to /mahou-debug (implementation bug, spec is right)
- REPLAN → route to /mahou-brainstorm (spec assumption was wrong)

This is the feedback loop that prevents forward-marching against a broken
spec.
</objective>

<context>
Target: $ARGUMENTS (spec UUID, spec path, plan path, or feature name from
ROADMAP)
</context>

<when_to_use>
Use after /mahou-orchestrator completes all tasks for a feature. This is the
gate between implementation and shipping.

If the implementation hasn't been built yet, tell the user to run
/mahou-orchestrator first.
</when_to_use>

<process>
### Phase 1: Load Context

1. **Resolve the target.** If $ARGUMENTS is a UUID, look for
   `./.mahou/specs/<uuid>.md` and `./.mahou/plans/<uuid>.md`. If it's
   a path, use it directly. If it's a feature name, look it up in ROADMAP.md.
2. **Read the spec** — extract UAT criteria / acceptance criteria / success
   criteria.
3. **Read the plan** — understand what was supposed to be built.
4. **Read state.json** — find the commit range (BASE_SHA of first task,
   HEAD_SHA of last task).
5. **Read ROADMAP.md** — check this feature's dependencies and status.

If the spec has no explicit UAT criteria, either:
- Ask the user to define acceptance criteria before verifying, OR
- Extract implicit criteria from the spec's goal and design sections.

### Phase 2: Dispatch Verifiers

For each UAT criterion, dispatch a verifier subagent using the template at
`{{MAHOU_HOME}}/references/verify-prompt.md`. Dispatch in parallel (batch
multiple Task calls in a single message).

Each verifier:
- Receives ONLY its single criterion (not the full list)
- Runs relevant tests (behavioral verification)
- Reads the implementation code (static verification)
- Returns: PASS | FAIL | UNCLEAR

### Phase 3: Synthesize Verdict

Collect all verifier verdicts and synthesize:

- **ALL PASS** → `PASS`
  - Route to /mahou-ship (or /mahou-secure if security-sensitive)
  - Update ROADMAP.md: feature status → `verified`

- **Any FAIL, and the failure is an implementation bug** (spec is correct,
  code is wrong) → `FIX_FORWARD`
  - Route to /mahou-debug with the specific failing criteria
  - Do NOT route to brainstorm — the spec is right, the code is wrong

- **Any FAIL, and the failure is a spec/plan assumption being wrong** (the
  spec assumed X but reality is Y) → `REPLAN`
  - Route to /mahou-brainstorm with the specific spec section to revise
  - The brainstorm agent will append to the revision log, not overwrite

- **Any UNCLEAR** → note for manual verification. If all others PASS, verdict
  is PASS with advisory. If others FAIL, use the FAIL routing above.

**Distinguishing FIX_FORWARD from REPLAN:**
- If the code doesn't do what the spec says → FIX_FORWARD (fix the code)
- If the spec asks for something that doesn't make sense, or the spec's
  assumption about how something works is wrong → REPLAN (fix the spec)
- When unsure: ask the user to adjudicate

### Phase 4: Write Report

Generate a UUID and write the verification report to
`./.mahou/verify/<uuid>.md`:

```markdown
# Verification Report: [feature name]

**Date:** [date]
**Spec:** [path]
**Plan:** [path]
**Commit range:** [BASE_SHA]..[HEAD_SHA]

## UAT Criteria Results

| # | Criterion | Verdict | Evidence |
|---|-----------|---------|----------|
| 1 | [criterion] | PASS | [evidence summary] |
| 2 | [criterion] | FAIL | [what's missing] |

## Overall Verdict: PASS | FIX_FORWARD | REPLAN

## Routing

- [If PASS]: Run /mahou-ship to create PR
- [If FIX_FORWARD]: Run /mahou-debug with: [specific failing criteria]
- [If REPLAN]: Run /mahou-brainstorm to revise: [spec section]

## Notes

[Any UNCLEAR criteria, advisory notes, edge cases observed]
```

### Phase 5: Update ROADMAP and Present

Update ROADMAP.md: feature status → `verified` (if PASS), `replan-needed`
(if REPLAN), or `fix-needed` (if FIX_FORWARD).

Present the verdict and routing recommendation to the user.
</process>

<error_handling>
- **No tests for a criterion:** Verifier returns UNCLEAR. Note "manual
  verification needed" in the report.
- **No UAT criteria in spec:** Ask user to define, or extract from spec goals.
- **Verifiers disagree on the same criterion:** Flag the conflict, present
  both assessments, ask user to adjudicate.
- **All PASS but code inspection reveals an uncovered edge case:** Verdict
  PASS with advisory note. This is FIX_FORWARD territory but not blocking —
  the spec was complete, the implementation has a gap.
- **state.json missing:** Can't determine commit range. Ask user for the
  commit range or check git log.
</error_handling>

<restrictions>
- You are read-only: no `edit` or `write` tools for source files. You may
  ONLY write to `./.mahou/verify/<uuid>.md` and update ROADMAP.md.
- Do NOT fix implementation bugs yourself. Route to /mahou-debug.
- Do NOT revise the spec yourself. Route to /mahou-brainstorm.
</restrictions>

<verifier_template>
@{{MAHOU_HOME}}/references/verify-prompt.md
</verifier_template>
