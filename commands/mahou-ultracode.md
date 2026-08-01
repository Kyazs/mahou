---
description: "Max-effort execution via large-scale parallel subagent workflows — audits, migrations, refactors"
argument-hint: "[task too large for one context window]"
model: opencode-go/grok-4.5
---

<objective>
Execute tasks too large for one context window by fanning out many subagents
in parallel waves, verifying their work adversarially, and returning a single
coordinated, verified answer. Use for: codebase-wide audits, large migrations,
multi-file refactors, cross-checked research.

This is the ultracode discipline. Your context is the script — you coordinate
waves via the Task tool, you do not do the item-level work yourself.
</objective>

<context>
User's task: $ARGUMENTS
</context>

<when_to_use>
Use for work that genuinely needs orchestration: 50+ files, 100+ items,
whole-repo sweeps, or tasks where the volume would blow through a single
context window.

Do NOT use for tasks that fit in a single turn — use the build agent or
`/mahou-debug`. For vague or green-field projects, plan first via
`/mahou-brainstorm` or the plan agent before fanning out writers.
</when_to_use>

<scope_confirm>
Before fanning out agents that write files: draft a concise plan (scope,
phases, what each wave will do, budget) and get the user's confirmation. This
is mandatory for any task that will modify the codebase. Read-only audits may
proceed after stating the plan.
</scope_confirm>

<patterns>
Load the workflow patterns skill and follow its patterns (fan-out audit with
adversarial verification, fix-until-green loops, multi-angle planning, chained
waves, budget rules):

@{{MAHOU_HOME}}/skills/mahou-ultracode-patterns/SKILL.md
</patterns>

<waves>
The core loop, per wave:

1. **Discover** — one explore subagent lists the items (files, endpoints,
   claims) as a structured list.
2. **Distribute** — fan out one subagent per item (batched, max 16 concurrent
   in a single message). Read-only work uses `explore`; write work uses
   `general` with self-contained briefs.
3. **Verify** — fan out independent verifier subagents to adversarially check
   the wave's output. Report or keep only what survives.
4. **Iterate** — if a check fails, feed failures back through another wave.
   Loop until pass or two consecutive rounds make no progress.
5. **Synthesize** — return a single coordinated answer with evidence (file
   paths, counts, diffs), not a transcript.
</waves>

<budget>
- Max 16 concurrent subagents per wave.
- Max agent nesting depth 3. `explore` cannot spawn subagents.
- Run a small slice before scaling: one directory, not the whole repo.
- For >1000 items, chain waves (≤100 per wave) and aggregate at the end.
- Always have an exit condition. Never loop without progress.
</budget>

<verification>
Every wave verifies its findings before you report them:
- Read-only audits: adversarial refutation pass (CONFIRMED / FALSE POSITIVE).
- Write work: after each wave, check `git diff` and read key sections of
  touched files. If wrong, fix and re-run — do not ship raw subagent output.
- Multi-angle plans: merge and reconcile before presenting.
</verification>

<model_selection>
- Mechanical item work (per-item audits, simple fixes): cheap/fast model.
- Synthesis, verification, merge steps: most capable model.
- You (the controller) do the coordination: keep your context lean by moving
  heavy content into subagent briefs.
</model_selection>

<red_flags>
- Fanning out writers without a confirmed plan -> STOP, confirm scope first.
- Reporting subagent output without a verification pass -> STOP, verify.
- Using this for a single-file change -> STOP, use the build agent.
- Two parallel implementers editing the same files -> STOP, they will conflict.
- Returning a transcript instead of a coordinated answer -> STOP, synthesize.
</red_flags>

<handoffs>
- **Upstream:** `/mahou-brainstorm` for design → spec → plan when the task
  needs design decisions first; `/mahou-review` findings that need
  whole-codebase sweeps.
- **Downstream:** `/mahou-debug` for a specific bug found by an audit;
  `/mahou-verify` when the work implements a spec; build agent for small
  follow-ups.
</handoffs>
