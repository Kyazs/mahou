---
name: mahou-receiving-review
description: How to respond when a reviewer returns issues — fix, don't argue, then re-request review. Use when the orchestrator re-dispatches an implementer to address reviewer findings.
---

# Receiving Code Review

A reviewer found issues in your work. This is the normal loop, not a failure.
Your job is to address the findings cleanly and re-submit — not to defend the
work.

## When a review comes back with issues

1. **Read every finding.** Don't skim past the ones that sting. Re-read the
   cited file:line and understand the issue on its own terms.
2. **Sort by severity.** Critical and Important issues block. Fix those first.
   Minor findings: fix them if cheap, note them if not.
3. **Fix, don't argue.** If a finding is correct (or even plausibly correct),
   fix it. The reviewer's job is to find problems; your job is to make them
   moot.
4. **Push back only with evidence.** If a finding is wrong, say so with the
   actual code as evidence — not with reasoning about what you meant. Cite
   the code, the test, or the spec. If you can't prove the finding wrong,
   fix it.
5. **Re-verify.** After fixing, re-run the failing tests and the suite
   (verification-before-completion discipline). Do not resubmit broken work.
6. **Report the deltas.** When you return to the reviewer, list what you
   changed in response to which findings. Never say "done" without saying
   what you did.

## Anti-patterns

- Arguing with the reviewer instead of fixing.
- "That's just how I wrote it" — style differences are not a reason to skip
  a maintainability finding.
- Fixing only the findings you agree with.
- Resubmitting without re-running tests.
- Silently ignoring a finding and hoping the reviewer won't re-check.
- Taking review personally. The review is about the code.

## When you genuinely disagree

State the disagreement in one paragraph with code evidence, then offer the
fix anyway if the cost is low. A review loop is cheaper than a production
bug. If the reviewer still insists and the change feels wrong, flag it to
the controller — don't quietly comply against your judgment, and don't
quietly refuse.
