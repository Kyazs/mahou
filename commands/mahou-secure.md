---
description: "Security verification of a change before shipping — PASS, FIX, or ESCALATE"
argument-hint: "[spec uuid, feature name from ROADMAP, or commit range]"
agent: mahou-readonly
model: opencode-go/grok-4.5
---

<objective>
Security verification gate for a completed change. Runs a focused security
review over the change's diff and its interaction surface, verifies findings
via subagents, and produces a routing verdict:

- PASS → proceed to /mahou-ship
- FIX → route to /mahou-debug (or the build agent for a surgical fix)
- ESCALATE → route to /mahou-brainstorm (the change needs design changes)

This is the security-sensitive path from /mahou-verify. Run it when the change
touches auth, payments, user data, secrets, network input, or anything
security-sensitive.
</objective>

<context>
Target: $ARGUMENTS (spec UUID, feature name from ROADMAP, or commit range
BASE..HEAD)
</context>

<when_to_use>
Use after /mahou-verify returns PASS and the feature is security-sensitive.
If verification hasn't passed, tell the user to run /mahou-verify first.
</when_to_use>

<process>
### Phase 1: Resolve the Change

1. Resolve the target. If $ARGUMENTS is a UUID or feature name, read
   `./.mahou/state.json` for the commit range (BASE_SHA..HEAD_SHA). If a
   commit range is given directly, use it. If empty, use the current branch
   vs its merge base.
2. Read the spec and plan for context on what the change is supposed to do.
3. Get the diff: `git diff <base>..<head> --stat`, then read the full diff.

### Phase 2: Security Triage

Review the diff against these categories, in priority order:

1. **Secrets and credentials** — hardcoded keys, tokens, passwords, or
   accidental commits of `.env`-style files.
2. **Injection** — SQL, command, template, path traversal, or deserialization
   injection in new/changed input paths.
3. **Auth and authorization** — missing or bypassable auth checks, IDOR
   (object-level access control), privilege escalation, broken session
   handling.
4. **Data exposure** — logging sensitive data, leaking internal details in
   errors, over-broad API responses.
5. **Input validation** — unchecked sizes, types, or encoding on new external
   inputs; unsafe parsing (XML, YAML, JSON with prototypes).
6. **Dependencies** — new dependencies with known vulnerabilities or odd
   provenance.
7. **Crypto and transport** — broken crypto, missing TLS, weak randomness.

For each potential issue: category, file:line, claim, and severity
(P0 critical / P1 important / P2 minor).

### Phase 3: Verify Findings

For EACH triaged issue, dispatch an independent `general` subagent (one per
issue, batched in parallel):

- Receives ONLY its single issue: the claim, category, file:line, severity,
  and the commit range.
- Reads the actual code and traces the attack path.
- Returns: **CONFIRMED** (real, exploitable or violating a security control,
  with evidence), **REFUTED** (not an issue, with reasoning), or
  **UNDETERMINED** (what's missing).

Spot-check thin CONFIRMED and surprising REFUTED verdicts against the real
code yourself.

### Phase 4: Verdict

- **No confirmed issues** → `PASS`. Update ROADMAP.md: security status →
  `cleared`. Route to /mahou-ship.
- **Confirmed P1/P0 issues** → `FIX`. Route to /mahou-debug with the specific
  findings (or the build agent for surgical fixes). Re-run secure after fixes.
- **Confirmed issues that require design changes** (e.g. auth architecture,
  data model changes) → `ESCALATE`. Route to /mahou-brainstorm with the
  findings.
- **P2 minor issues** → `PASS WITH NOTES`. List them in the report for the
  reviewer/PR.

### Phase 5: Write Report

Write the security report to `./.mahou/verify/secure-<uuid>.md`:

```markdown
# Security Report: [feature name]

**Date:** [date]
**Commit range:** [base]..[head]

## Findings

| # | Category | Severity | Verdict | Evidence |
|---|----------|----------|---------|----------|
| 1 | [category] | [P0-P2] | CONFIRMED/REFUTED | [evidence] |

## Verdict: PASS | FIX | ESCALATE

## Routing

- [If PASS]: Run /mahou-ship
- [If FIX]: Run /mahou-debug with: [specific findings]
- [If ESCALATE]: Run /mahou-brainstorm to revise: [design areas]
```

Present the verdict and routing recommendation to the user.
</process>

<error_handling>
- **No commit range resolvable:** Ask the user for the range or use
  `git log --oneline -10` to identify the feature's commits.
- **Not a security-sensitive change:** Report that and suggest plain
  /mahou-ship. Do not pad the report.
- **Verifiers disagree:** Flag the conflict, re-check the code yourself,
  adjudicate.
</error_handling>

<restrictions>
- You are read-only: no `edit` or `write` tools. You may ONLY write the
  security report via bash and update ROADMAP.md.
- Do NOT fix issues yourself. Route to /mahou-debug or the build agent.
- Do NOT fabricate findings. If nothing is confirmed, the verdict is PASS.
</restrictions>
