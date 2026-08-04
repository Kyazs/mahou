---
description: "Execute a plan task-by-task via subagents with two-stage review"
argument-hint: "[path to plan file, e.g. ./.mahou/plans/<uuid>.md]"
agent: mahou-readonly
---

<objective>
Execute an implementation plan by dispatching a fresh subagent per task, with a
two-stage review after each task: **spec compliance review first, then code
quality review.** This is the subagent-driven-development discipline.

This command runs under the `mahou-readonly` agent: you do NOT implement
directly — you delegate. `edit`/`write` are tool-enforced deny. Subagents you
dispatch handle the writes and commits.
   You MAY write to `./.mahou/state.json` and `./.mahou/ROADMAP.md` via
   bash commands (e.g., `Set-Content`, `echo >`). These are metadata files,
   not source code. You may NOT use `edit` or `write` tools on source files.
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
Use when you have an implementation plan (typically from `/mahou-brainstorm`,
saved at `./.mahou/plans/<uuid>.md`) and the tasks are mostly independent.

If the work is a single focused change, tell the user to use the build agent
instead. If there's no plan, tell them to run `/mahou-brainstorm` first.
</when_to_use>

<process>
### Pre-execution

1. **Read the plan once.** Extract all tasks with their full text AND:
   - The `Parallel` flag from the plan header (default: false)
   - The `Integration check interval` from the plan header (default: 3)
   - The `Dependency graph` from the plan header (if present)
2. **Read project context (if exists):**
   - `./.mahou/map.md` — codebase memory. Include relevant portions in
     implementer context.
   - `./.mahou/models.json` — optional model routing config (maps task
     categories and subagent roles to model IDs; see README "Model
     selection" for the schema). If present, use it for model selection.
     If absent, use the session's current model (the opencode default) —
     never invent a provider ID. If the model you need differs from the
     session model, ask the user to set it via `/models` before dispatch.
   - `./.mahou/PROJECT.md` — project conventions. Include relevant
     conventions in implementer context.
3. **Initialize state.** Create or reset `./.mahou/state.json` with:
   - plan path, spec path, started_at timestamp
   - config: { parallel, integration_check_interval }
   - tasks: all pending, no SHAs yet
   - last_known_good_sha: current HEAD
4. **Baseline verification gate.** Before ANY task is implemented, establish
   a clean baseline so later failures are attributable to the implementation,
   not pre-existing state:
   - Run the project's test suite once: `npm test` / `pytest` / `go test`
     / `cargo test` / whatever the project uses (check package.json,
     pyproject.toml, Makefile, CI config).
   - Run the build/typecheck if the project has one: `npm run build`,
     `npx tsc --noEmit`, etc.
   - Record in state.json under `baseline`: `{ tests: "pass"|"fail"|"no-suite",
     build: "green"|"broken"|"n/a", notes, sha }`.
   - If the baseline is BROKEN or FAILING: STOP. Tell the user the baseline
     is red and route to `/mahou-debug` — implementing on a red baseline
     makes every later failure uninterpretable. Do not start tasks.
   - If there is no test suite or build: record `no-suite` / `n/a` and
     proceed, but note it — integration checks and verification will lean on
     static review.

### Step-by-step

1. **Tasks already extracted in pre-execution.** Use the tasks, flags, and
   context gathered in the Pre-execution section above. Do not re-read the plan.
2. **Create a todo list** with every task from the plan.
3. **Per task:**
   - Capture the **BASE_SHA** (`git rev-parse HEAD`) before dispatching.
   - Write state.json: mark task as `in_progress`, record `time_started`.
   - Dispatch an **implementer subagent** (`subagent_type: "implementer"`)
     with the full task text pasted into the prompt (the subagent never reads
     the plan file). The implementer agent is tool-enforced full-access for
     writes but denies push/reset/destructive commands. Paste the scene-setting
      context. Pick the model per the model-selection rule (models.json -> session model).
   - If the implementer asks questions, **answer them** and re-dispatch.
    - Handle the implementer's status (see below).
    - **NEEDS_CONTEXT with external unknown:** If the implementer needs
      context about an external library, API, or documentation that isn't
      in the plan or codebase:
      - Dispatch a `general` subagent with `webfetch` access to research
        the external unknown (2-3 pages max).
      - The subagent returns a brief (NOT raw pages).
      - Feed the brief to the implementer and re-dispatch.
      - This is condition-gated: only fires for external unknowns, not for
        plan/spec ambiguities (those are answered from the plan).
    - Dispatch a **spec compliance reviewer** (`subagent_type:
     "spec-reviewer"`). Loop until it passes.
   - Dispatch a **code quality reviewer** (`subagent_type:
     "code-quality-reviewer"`), passing BASE_SHA and HEAD_SHA. Loop until
     Approved.
    - **Record review loop counts in state.json:** After each spec compliance
      loop, record `spec_compliance_loops`. After each code quality loop,
      record `code_quality_loops`. If the implementer was blocked, record
      `was_blocked: true` and the concern.
    - **Update state.json:** mark task as `complete`, record `head_sha`,
      `model` used, `time_completed`, and any `concerns`. Set
      `ui_task: true` if the task touched UI code.
    - **Update ROADMAP.md:** update task-level status for this feature.
    - Mark the task complete in the todo list.
   - **Integration check (every N tasks):** After every N tasks (N from the
     plan header, default 3), dispatch an integration reviewer subagent
     (`subagent_type: "integration-reviewer"`), passing BASE_SHA (from before
     the first task) and current HEAD_SHA.
     The reviewer checks: interfaces between tasks still align, earlier
     tests still pass, build is green.
     - If PASS: continue to next task.
     - If FAIL: STOP. Route to /mahou-debug for targeted fix at the seam.
       Do not proceed until integration is restored.
     - Record the result in state.json under `integration_checks`.
4. **After all tasks:** dispatch a **final code reviewer** for the entire
   implementation, then tell the user the work is done and how to finish the
   branch.
</process>

<model_selection>
- If `./.mahou/models.json` exists, use its `tasks` map (mechanical /
  standard / capable) and `roles` map for dispatch, falling back to its
  `default` for anything unmapped.
- If it does not exist, use the session's current model — the opencode
  default (project `opencode.json`, then global config, then session).
  Do NOT invent provider or model IDs.
- If the needed model differs from the session model, ask the user to set
  it via `/models` before dispatching subagents.
</model_selection>

<implementer_status>
**DONE:** Proceed to spec compliance review.

**DONE_WITH_CONCERNS:** Read concerns. Address correctness/scope concerns before
review. Note observations and proceed.

**NEEDS_CONTEXT:** Provide missing context and re-dispatch.

**BLOCKED:** Assess: context problem -> provide more context. Needs more
reasoning -> more capable model. Too large -> break into smaller pieces. Plan
wrong -> escalate to human.

**BLOCKED 3+ times on the same task:** Stop. Flag "the plan may be wrong for
this task." Route to /mahou-brainstorm to replan the affected task. Do not
keep retrying with the same approach.

**Spec compliance review loops 3+ times:** Flag "the spec may be ambiguous for
this task." Ask the human to review the spec section. The implementer may be
interpreting the requirement differently than intended.

**Code quality review loops 3+ times:** Flag "the implementer may be
under-resourced for this task." Consider upgrading to a more capable model
or breaking the task into smaller pieces.

**When a reviewer returns issues:** re-dispatch the same implementer with the
review findings AND the receiving-review discipline pasted in (see
prompt_templates). The implementer fixes, re-verifies (verification-before-
completion), and reports deltas — not excuses. Pushback is only valid with
code evidence.

Never ignore an escalation or force the same model to retry without changes.
</implementer_status>

<red_flags>
**Never:**
- Start implementation on main/master without explicit user consent.
- Start implementation on a red baseline (failing tests/build before task 1).
- Skip reviews (spec compliance OR code quality).
- Start code quality review before spec compliance passes (wrong order).
- Proceed with unfixed Critical/Important issues.
- Move to the next task while either review has open issues.
- Let the implementer's self-review replace actual review — both are needed.
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
- Declare a task done from subagent reports alone -- read the diff and spot-check
  the claims before marking complete.
</red_flags>

<integration>
- **Upstream:** `/mahou-brainstorm` produces the spec and plan that this command
  executes.
- **Downstream:** Small follow-ups go to the build agent. After all tasks pass
  review, finish the branch (merge, PR, or cleanup).
- Subagents should use TDD for each task (the implementer prompt instructs this).
</integration>

<prompt_templates>
Reference prompt templates for the role subagents (the agents
agents/implementer.md, spec-reviewer.md, code-quality-reviewer.md,
integration-reviewer.md carry their own discipline and tool enforcement;
the templates below hold the detailed techniques to paste into dispatch
messages as needed):

@{{MAHOU_HOME}}/references/implementer-prompt.md

@{{MAHOU_HOME}}/references/spec-reviewer-prompt.md

@{{MAHOU_HOME}}/references/code-quality-reviewer-prompt.md

@{{MAHOU_HOME}}/references/integration-reviewer-prompt.md

@{{MAHOU_HOME}}/skills/mahou-git-workflow/SKILL.md

@{{MAHOU_HOME}}/skills/mahou-receiving-review/SKILL.md

@{{MAHOU_HOME}}/skills/mahou-verification-completion/SKILL.md
</prompt_templates>
