---
name: mahou-verification-completion
description: Verify work is actually done before declaring it done — run the failing repro, run the suite, show evidence. Use before reporting DONE in mahou-debug Phase 4, the implementer prompt, and any fix claim.
---

# Verification Before Completion

Never declare work complete based on code inspection alone. A fix is done when
the evidence says so: the failing reproduction now passes, and the relevant
suite is green.

## The discipline

Before you report anything as done — a fix, a task, a feature — run these in
order:

1. **Run the original failing reproduction.** The exact thing that was broken.
   It must now pass. If you can't run it, say so explicitly and say why.
2. **Run the relevant test suite.** Not just the one test — the suite around
   the change (module, package, or full suite depending on blast radius).
3. **Check for regressions.** Were any other tests broken by the change? Was
   anything that previously passed now failing?
4. **State the evidence.** What you ran, what it showed (pass/fail counts),
   and what that proves.

## Evidence format

```
Verification:
- Repro: [command run] → [result — pass/fail]
- Suite: [command run] → [N passed, M failed]
- Regressions: none | [list]
```

Evidence means actual output, not memory. If you didn't run it, don't claim it.

## When evidence is impossible

- No test framework exists: run the repro manually and report exactly what
  you did and saw.
- The failure is environmental: state that it couldn't be reproduced, and
  what you did verify.
- Mark the claim as UNVERIFIED and flag it. Do not let unverified work slide
  silently — say "not verified" out loud.

## Anti-patterns

- "The fix looks correct" without running anything → not verified.
- "The tests pass" without having run them → fabrication.
- "It probably fixes the edge case too" → verify or say it's unverified.
- Skipping the full suite "because the change is small" → small changes
  break tests too. Run the relevant suite.
- Assuming the original repro is fixed because the test suite is green →
  run the repro explicitly. Tests and repros are different evidence.
