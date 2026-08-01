---
name: mahou-ultracode-patterns
description: Large-scale execution patterns for mahou-ultracode — fan-out pipelines, adversarial verification, fix-until-green loops, multi-angle planning, budget rules. Load before fanning out.
---

# Ultracode Workflow Patterns

Adapted for opencode from the pi ultracode discipline. The controller (you, in
mahou-ultracode) coordinates many subagents via the Task tool — there is no
separate script engine; your context is the script.

## Agent types

- `explore` — read-only, fast, cheap. Use for discovery, search, and any
  read-only fan-out. Cannot modify files.
- `general` — full tools (except todo). Use for writes, fixes, and tasks that
  need judgment. Can spawn subagents.
- Custom mahou agents (implementer, spec-reviewer, code-quality-reviewer,
  issue-verifier) are available to the orchestrator and review flows.

Budget rules:
- Up to **16 concurrent** subagents per wave. Batch independent Task calls in
  a single message so they run concurrently.
- Max agent nesting depth: 3. `explore` cannot spawn subagents.
- Run a small slice before scaling: one directory, not the whole repo.
- If a wave needs >1000 agents, split into chained waves and aggregate.

## Fan-out audit with adversarial verification

Discover items, audit each in parallel, then have independent agents refute
findings. Only report what survives.

```
1. Dispatch ONE explore subagent: "List every <item> under <path>" — ask for a
   structured list (one item per line).
2. Fan out N audit subagents in parallel (one per item, batched ≤16 at a
   time): "Audit <item> for <issue class>. Report each finding with file path
   and line range."
3. Fan out N verifier subagents in parallel: "Adversarially verify this
   finding. Real bug or false positive? Reply ONLY 'CONFIRMED' or 'FALSE
   POSITIVE'." — one per finding.
4. Report only findings that survive verification.
```

## Fix-until-green loop

Run a checker, fix failures in parallel, repeat until pass or no progress.

```
1. Run the checker yourself (bash): build / typecheck / test suite.
2. Parse failures into a list (file:line:message).
3. Fan out one fixer subagent per failure (≤16 concurrent): "Fix this:
   <file>:<line> — <message>. Minimal change."
4. Re-run the checker.
5. Repeat. Exit when: checker passes, or two consecutive rounds make no
   progress (then STOP and report what remains).
```

## Parallel-agent dispatch (superpowers patterns)

Concurrent subagent workflows are the core of ultracode. Apply these rules:

- **Batch by dependency, not by volume.** Only parallelize work that is
  genuinely independent — no shared files, no sequential reads. Dependent
  steps run in order: discover → then fan out → then verify.
- **Confirmation before the write wave.** Never dispatch a wave of writers
  (general agents that modify files) before the user has confirmed the plan.
  Read-only waves (explore) may run after stating the plan.
- **Watchpoints between waves.** After each wave that writes files, run a
  checkpoint: `git diff --stat`, read key sections, run the relevant tests
  if feasible. Do not launch the next wave on unverified output.
- **One owner per file.** Two agents editing the same file in parallel
  guarantees conflicts. Partition the work by file ownership before
  dispatching.
- **Bounded waves.** Max 16 concurrent agents; for very large work, process
  in batches of ≤100 items and aggregate between batches. Never scale a
  pattern beyond what you validated on a small slice.
- **Aggregate, don't concatenate.** After each wave, have a synthesis agent
  (or yourself) compress results into a compact summary before the next wave.
  The summary — not the raw outputs — feeds forward.
- **Adversarial pass per wave.** Findings that will be reported should
  survive an independent refutation pass. Cheap insurance: one verifier per
  finding, reply-only "CONFIRMED"/"FALSE POSITIVE".

## Multi-angle planning

Draft a plan from independent angles, then merge and reconcile.

```
1. Dispatch 2-3 planning subagents in parallel with deliberately different
   directives: (A) minimal change, reuse existing patterns; (B) clean-sheet,
   zero tolerance for legacy; (C) middle ground.
2. Dispatch ONE merge subagent with all three plans: "Merge into one
   reconciled plan. Pick the strongest parts of each, note trade-offs."
```

## Research with cross-checking

Fan out research across sources, then cross-check every claim.

```
1. Fan out N explore/general subagents, one per source: "Research <topic> in
   <source>. List every concrete claim."
2. Collect claims.
3. Fan out one cross-check subagent per claim: "Cross-check this claim against
   the codebase: '<claim>'. Reply 'VERIFIED' or 'WRONG' with explanation."
4. Report verified claims; flag wrong ones.
```

## Chained waves for very large work (>1000 items)

```
1. Discover + batch: one explore subagent lists all items; split into batches
   (≤100 items per wave).
2. Process each batch as its own fan-out wave, feeding results forward.
3. Final aggregator subagent: "Summarize these results into a concise report."
```

## Decompose large tasks into phases

Discover → migrate → verify as separate fan-out phases, feeding results
forward. Keep intermediate results in your context as compact summaries — do
not carry raw agent transcripts across phases.

## Do's and don'ts

- DO confirm the plan with the user before fanning out agents that write files.
- DO include verification passes. Never report raw agent output without review.
- DO return a single coordinated answer, not a transcript.
- DO check `git diff` and read key sections of files agents touched.
- DON'T use ultracode for tasks that fit in a single turn.
- DON'T fan out writers for vague or green-field work — draft a plan and get
  confirmation first.
- DON'T dispatch multiple implementers that edit the same files in parallel.
- DON'T write unbounded loops — always have an exit condition.
