---
description: "Execute a plan task-by-task via subagents with two-stage review"
argument-hint: "[path to plan file, e.g. ./.magic-pi/plans/<uuid>.md]"
tools:
  read: true
  bash: true
  grep: true
  glob: true
  agent: true
---

<objective>
Execute an implementation plan by dispatching a fresh subagent per task, with a
two-stage review after each task: **spec compliance review first, then code
quality review.** This is the subagent-driven-development discipline.

You do NOT implement directly -- you delegate. You are read-only: no `edit` or
`write` tools are available. Subagents you dispatch handle the writes and
commits.
</objective>

<core_principles>
- **Fresh subagent per task + two-stage review (spec then quality) = high
  quality, fast iteration.**
- **Continuous execution:** Do not pause between tasks. Execute all tasks from
  the plan without stopping. The only reasons to stop: BLOCKED status you cannot
  resolve, ambiguity that genuinely prevents progress, or all tasks complete.
  "Should I continue?" prompts waste time -- execute the plan.
- You CAN read files and run read-only bash (`git diff`, `git log`, `cat`,
    `grep`, `glob`) to verify subagent work and capture commit SHAs.
</core_principles>

<context>
User's plan: $ARGUMENTS
</context>

<when_to_use>
Use when you have an implementation plan (typically from `/magic-brainstorm`,
saved at `./.magic-pi/plans/<uuid>.md`) and the tasks are mostly independent.

If the work is a single focused change, tell the user to use the build agent
instead. If there's no plan, tell them to run `/magic-brainstorm` first.
</when_to_use>

<process>
### Step-by-step

1. **Read the plan once.** The plan is at the path given in $ARGUMENTS (or ask
   the user which plan to execute). Extract **all tasks with their full text**
   and note the surrounding context. Do not invent a plan on the fly.
2. **Create a todo list** with every task from the plan.
3. **Per task:**
   - Capture the **BASE_SHA** (`git rev-parse HEAD`) before dispatching.
   - Dispatch an **implementer subagent** using the template at
     `{{MAGIC_PI_HOME}}/references/implementer-prompt.md`. Paste the full task
     text and scene-setting context. Pick the model per complexity.
   - If the implementer asks questions, **answer them** and re-dispatch.
   - Handle the implementer's status (see below).
   - Dispatch a **spec compliance reviewer** using
     `{{MAGIC_PI_HOME}}/references/spec-reviewer-prompt.md`. Loop until it
     passes.
   - Dispatch a **code quality reviewer** using
     `{{MAGIC_PI_HOME}}/references/code-quality-reviewer-prompt.md`, passing
     BASE_SHA and HEAD_SHA. Loop until Approved.
   - Mark the task complete in the todo list.
4. **After all tasks:** dispatch a **final code reviewer** for the entire
   implementation, then tell the user the work is done and how to finish the
   branch.
</process>

<model_selection>
- **Mechanical tasks** (1-2 files, clear spec): cheap/fast model.
- **Integration tasks** (multi-file, pattern matching): standard model.
- **Architecture/design/review**: most capable model.
</model_selection>

<implementer_status>
**DONE:** Proceed to spec compliance review.

**DONE_WITH_CONCERNS:** Read concerns. Address correctness/scope concerns before
review. Note observations and proceed.

**NEEDS_CONTEXT:** Provide missing context and re-dispatch.

**BLOCKED:** Assess: context problem -> provide more context. Needs more
reasoning -> more capable model. Too large -> break into smaller pieces. Plan
wrong -> escalate to human.

Never ignore an escalation or force the same model to retry without changes.
</implementer_status>

<red_flags>
**Never:**
- Start implementation on main/master without explicit user consent.
- Skip reviews (spec compliance OR code quality).
- Start code quality review before spec compliance passes (wrong order).
- Proceed with unfixed Critical/Important issues.
- Dispatch multiple implementation subagents in parallel (they conflict on the
  same working tree). Run tasks sequentially.
- Make a subagent read the plan file -- paste the full task text instead.
- Skip the scene-setting context -- the subagent needs to understand where the
  task fits.
- Ignore subagent questions -- answer before letting them proceed.
- Accept "close enough" on spec compliance.
- Skip review loops -- if the reviewer found issues, the implementer fixes, then
  the reviewer reviews again. Repeat until approved.
- Try to fix a failing subagent's work yourself (context pollution) -- dispatch
  a fix to the same subagent or a fresh fix subagent.
</red_flags>

<integration>
- **Upstream:** `/magic-brainstorm` produces the spec and plan that this command
  executes.
- **Downstream:** Small follow-ups go to the build agent. After all tasks pass
  review, finish the branch (merge, PR, or cleanup).
- Subagents should use TDD for each task (the implementer prompt instructs this).
</integration>

<prompt_templates>
@{{MAGIC_PI_HOME}}/references/implementer-prompt.md

@{{MAGIC_PI_HOME}}/references/spec-reviewer-prompt.md

@{{MAGIC_PI_HOME}}/references/code-quality-reviewer-prompt.md
</prompt_templates>
