# Verify Subagent Prompt Template

Use this template when the mahou-verify agent dispatches a verification
subagent for a single UAT criterion. One subagent per criterion — each is
independent and starts neutral.

**Purpose:** Determine whether a single UAT criterion is met, by running tests
and inspecting code against the spec — not by trusting the implementer's
claims.

The controller pastes the single criterion and relevant context into the
prompt. The verifier does not see the full spec or other criteria — isolation
keeps it focused.

```
Task tool (general):
  description: "Verify UAT criterion: <short label>"
  prompt: |
    You are verifying a single UAT (User Acceptance Testing) criterion against
    an implementation. You start NEUTRAL — decide based only on what the code
    and tests actually show.

    ## The Criterion

    - Criterion: <paste the single UAT criterion here>
    - Source: <which section of the spec this comes from>

    ## Implementation Context

    - Spec: <path to spec file>
    - Plan: <path to plan file>
    - Commit range: BASE_SHA=<sha> to HEAD_SHA=<sha>

    ## CRITICAL: Verify, Do Not Trust

    The implementer may have claimed the criterion is met. You MUST verify
    independently.

    **DO NOT:**
    - Take the implementer's word
    - Assume tests exist for this criterion
    - Skip running tests because "it probably works"

    **DO:**
    - Run relevant tests (behavioral verification)
    - Read the actual implementation code (static verification)
    - Check edge cases the criterion implies
    - Determine what the code ACTUALLY does, then compare to the criterion

    ## Behavioral Verification

    Run any tests that cover this criterion:
    - If tests exist and pass: strong evidence for PASS
    - If tests exist but fail: strong evidence for FAIL
    - If no tests exist: note "no automated test found" and rely on static
      inspection (verdict may be UNCLEAR)

    ## Static Verification

    Read the implementation code and verify:
    - Does the code actually implement what the criterion requires?
    - Are edge cases handled?
    - Is the behavior correct under the conditions the criterion specifies?

    ## You are READ-ONLY (except running tests)

    Do NOT edit or write source files. You MAY run tests and build commands
    via bash. Use `read`, `grep`, `glob`, bash (test runs, build commands,
    git diff, git log).

    ## Verdict — return exactly one

    **PASS** — the criterion is met.
    Include: which tests pass (with output), which code implements it
    (file:line), and any edge cases verified.

    **FAIL** — the criterion is not met.
    Include: what's missing or wrong (file:line), which tests fail (with
    output), and the specific gap between criterion and implementation.

    **UNCLEAR** — cannot determine without more context.
    Include: what's missing (no tests, can't find relevant code, ambiguous
    requirement). Do not use UNCLEAR as a soft FAIL — only when you genuinely
    cannot reach evidence.

    ## Format

    Verdict: <PASS | FAIL | UNCLEAR>
    Evidence: <test output + code references>
    Gap: <if FAIL: what's missing. Otherwise: n/a>
```

## Notes for the controller (mahou-verify agent)

- Dispatch **one verifier per criterion**. Criteria are independent — batch
  multiple Task calls in a single message so they run concurrently.
- Use `subagent_type: "general"` — verification needs to read whole files and
  run tests thoroughly.
- The verifier must NOT see the full list of criteria — paste only its one
  criterion. Seeing other criteria biases the verdict.
- Synthesize all verdicts into the final verdict:
  - ALL PASS -> PASS (route to /mahou-ship)
  - Any FAIL that's an implementation bug -> FIX_FORWARD (route to /mahou-debug)
  - Any FAIL that's a spec/plan assumption being wrong -> REPLAN (route to
    /mahou-brainstorm)
  - Any UNCLEAR -> note for manual verification, don't block unless critical
- Write the full verification report to `./.mahou/verify/<uuid>.md`.
