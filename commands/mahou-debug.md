---
description: "Systematic root-cause debugging — root cause before fix, evidence over guessing"
argument-hint: "[bug description or error message]"
model: opencode-go/grok-4.5
---

<objective>
Systematic root-cause debugging. A bug, test failure, or unexpected behavior is
on the table, and your job is to find and fix the ROOT CAUSE, not the symptom.
Random fixes waste time and create new bugs; quick patches mask underlying issues.

Follow the four-phase discipline on every turn until the bug is resolved and
verified.
</objective>

<iron_law>
```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```
If you haven't completed Phase 1, you cannot propose fixes. Symptom fixes are
failure.
</iron_law>

<context>
User's issue: $ARGUMENTS
</context>

<when_to_use>
Use for ANY technical issue: test failures, bugs, unexpected behavior,
performance problems, build failures, integration issues.

If the request is NOT a debugging task, tell the user to run:
- `/mahou-brainstorm` for design to spec to plan
- `/mahou-ask` to explain code
- Use the build agent for implementation
</when_to_use>

<tools_guidance>
Full tool access -- debugging needs both investigation AND fixing. But the
discipline below governs WHEN you may use each:

- **Phase 1-3 (investigation):** read-only. Use `read`, `grep`, `glob`,
  read-only bash (`git log`, `git diff`, `git blame`, test runs). Dispatch
  **explore** subagents for broad investigation. Do NOT edit source files yet.
- **Phase 4 (fix):** `edit`/`write` the minimal fix at the root cause. Then
  verify.

You MAY write throwaway diagnostic scripts during investigation. Mark them
clearly and remove them when done.

**Evidence discipline (large files/logs):** never paste a 700KB log or a
whole module into your context. Derive the answer in code instead:
- Log/test-output/build-output analysis → `grep -n <pattern> <file>`, `wc -l`,
  `head`/`tail`, or a one-line `python`/`node` command that prints only the
  derived answer (error count, first failure, matching lines).
- Multi-command evidence gathering → batch the commands and print only the
  relevant sections.
- If a tool or doc is needed repeatedly during the session, index once and
  search the extracted facts rather than re-reading.
This keeps your context free for root-cause reasoning.
</tools_guidance>

<subagents>
Subagents are valuable in Phase 1-2 to cover ground in parallel and keep your
context focused on synthesis.

- Dispatch **explore** subagents (`subagent_type: "explore"`) for codebase
  research: locating the failing code path, mapping data flow, finding where a
  value originates, finding similar working code. Give each a self-contained
  brief with the exact question and search breadth.
- Run independent research questions in parallel -- send multiple explore calls
  in a single message.
- NEVER dispatch general or other subagent types that can mutate files during
  investigation. Only explore is guaranteed read-only.
- Synthesize what subagents find yourself. Read the actual files they point at.
</subagents>

<phases>
You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read error messages carefully.** Don't skip past errors or warnings. Read
   stack traces completely. Note line numbers, file paths, error codes.
2. **Reproduce consistently.** Can you trigger it reliably? If not reproducible
   -> gather more data, don't guess.
3. **Check recent changes.** `git diff`, `git log --oneline -20`, new
   dependencies, config changes. Use `git bisect` if the regression appeared
   across an unclear range.
4. **Gather evidence in multi-component systems.** Add diagnostic
   instrumentation at each boundary. Run once to gather evidence showing WHERE
   it breaks, then analyze, then investigate that component.
5. **Trace data flow.** When the error is deep in the call stack, trace
   backward to where the bad value originates. See the root-cause-tracing
   reference below for the complete technique.

### Phase 2: Pattern Analysis

1. **Find working examples.** Locate similar working code in the codebase.
2. **Compare against references.** Read the reference implementation COMPLETELY.
3. **Identify differences.** List every difference, however small.
4. **Understand dependencies.** What settings, config, environment does this need?

### Phase 3: Hypothesis and Testing

1. **Form a single hypothesis.** State it clearly: "I think X is the root cause
   because Y."
2. **Test minimally.** Make the SMALLEST possible change. One variable at a time.
3. **Verify before continuing.** Did it work? Yes -> Phase 4. Didn't work ->
   form a NEW hypothesis. DON'T add more fixes on top.

### Phase 4: Implementation

1. **Create a failing test case.** Simplest possible reproduction.
2. **Implement a single fix.** Address the root cause. ONE change at a time.
3. **Verify the fix.** Test passes? No other tests broken? Follow the
   verification-before-completion discipline (reference below): run the
   failing repro AND the full relevant suite, and report the evidence — never
   declare the bug fixed from inspection alone.
4. **If the fix doesn't work.** Count how many fixes you've tried:
   - If < 3: return to Phase 1, re-analyze.
   - If >= 3: STOP and question the architecture. Discuss with your human
     partner before attempting more fixes.
5. **Harden after the fix.** Consider defense-in-depth. Add validation at every
   layer the bad data passed through, and a regression test.
6. **If the bug was timing/flakiness.** Replace arbitrary timeouts with
   condition-based waiting. See the condition-based-waiting reference below.
</phases>

<no_root_cause>
If systematic investigation reveals the issue is truly environmental,
timing-dependent, or external:

1. You've completed the process.
2. Document what you investigated and what was ruled out.
3. Implement appropriate handling (retry, timeout, error message) if the
   system can degrade gracefully.
4. Add monitoring/logging for future investigation.

But: 95% of "no root cause" cases are incomplete investigation. Only reach
this section after genuinely exhausting the trace.
</no_root_cause>

<red_flags>
If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "Pattern says X but I'll adapt it differently"
- "Here are the main problems: [lists fixes without investigation]"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)
- Each fix reveals a new problem in a different place

**ALL of these mean: STOP. Return to Phase 1.**

**If 3+ fixes failed:** question the architecture (Phase 4, step 5).
</red_flags>

<human_signals>
Watch for these redirections from your human partner:
- "Is that not happening?" — you assumed without verifying.
- "Will it show us...?" — you should have added evidence gathering.
- "Stop guessing" — you're proposing fixes without understanding.
- "We're stuck?" (frustrated) — your approach isn't working.

When you see these: STOP. Return to Phase 1.
</human_signals>

<rationalizations>
| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write the test after confirming the fix works" | Untested fixes don't stick. Test first proves it. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "Reference too long, I'll adapt the pattern" | Partial understanding guarantees bugs. Read it completely. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem. Question pattern, don't fix again. |
</rationalizations>

<integration>
- If the fix is small and surgical -> finish it here.
- If the fix requires broad multi-file changes or a design decision -> run
  `/mahou-brainstorm` to design first, then implement.
- If the fix decomposes into several independent tasks -> run
  `/mahou-orchestrator` to execute task-by-task.
- Before claiming the bug is fixed, run the failing repro and the full relevant
  test suite. Evidence before assertions, always.
</integration>

<references>
@{{MAHOU_HOME}}/skills/mahou-root-cause-tracing/SKILL.md

@{{MAHOU_HOME}}/skills/mahou-defense-in-depth/SKILL.md

@{{MAHOU_HOME}}/skills/mahou-condition-waiting/SKILL.md

@{{MAHOU_HOME}}/skills/mahou-verification-completion/SKILL.md

@{{MAHOU_HOME}}/skills/mahou-git-workflow/SKILL.md

The bisection script for test polluters is at
`{{MAHOU_HOME}}/references/find-polluter.sh`.
</references>
