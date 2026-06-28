# mahou

> 魔法 — _mahou_ is Japanese for "magic".

A portable set of opencode slash commands that enforce disciplined software engineering workflows — debugging, review, brainstorm, orchestration, and project lifecycle management.

No plugins, no MCP servers, no npm dependencies. Just markdown command files and reference docs.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Quick Reference](#quick-reference)
- [Commands](#commands)
- [Workflows](#workflows)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Contributing](#contributing)
- [License](#license)

## Background

opencode ships built-in `plan` and `build` agents that do the work. mahou
commands enforce *how* the work is done — root cause before fix, verify before
report, design before code, ship after verify.

The framework operates across three layers:

- **Project layer** — initialize projects, research approaches, map existing
  codebases. Produces PROJECT.md, ROADMAP.md, and map.md for cross-feature
  context.
- **Feature layer** — brainstorm specs, orchestrate implementation, review
  code, verify against spec. The core build cycle with feedback loops.
- **Lifecycle layer** — resume sessions, ship PRs. Closes the loop between
  implementation and delivery.

### How it works

Each command is a markdown file with YAML frontmatter. opencode reads the
frontmatter to register the slash command and enforce tool access. The body
becomes the command's prompt.

- **Tool access is enforced, not requested.** The `tools:` frontmatter lists
  which tools a command may use. Read-only commands omit `write`/`edit` —
  opencode blocks mutations at the tool level, not just by prompt instruction.
- **Reference docs load via `@`-includes.** Command bodies use
  `@{{MAHOU_HOME}}/references/<file>.md` to pull in technique guides and
  subagent prompt templates. The token is resolved to an absolute path at
  install time.
- **Zero structural token cost.** Nothing auto-injects on every prompt. All
  context loads only when a command is invoked. Heavy data (web pages, large
  file reads) stays inside subagent disposable context.
- **No runtime dependencies.** Everything is static markdown. Nothing is
  downloaded from the internet. No MCP servers, no hooks, no telemetry.

## Install

### Prerequisites

- [opencode](https://opencode.ai) installed and working
- That's it. No npm dependencies, no plugins, no MCP servers.

### Windows (PowerShell)

```powershell
cd mahou
.\install.ps1
```

### macOS / Linux (bash)

```bash
cd mahou
chmod +x install.sh
./install.sh
```

**After install, restart opencode** for the new commands to appear.

### Upgrading from magic-pi

mahou was previously named `magic-pi-opencode`. The installer does not remove
the old global files. If you upgraded, clean up the legacy install once:

```powershell
# Windows (PowerShell)
Remove-Item "$env:USERPROFILE\.config\opencode\magic-pi" -Recurse -Force
Remove-Item "$env:USERPROFILE\.config\opencode\command\magic*.md" -Force
```
```bash
# macOS / Linux (bash)
rm -rf ~/.config/opencode/magic-pi
rm -f ~/.config/opencode/command/magic*.md
```

Existing project artifacts live in `./.magic-pi/`; rename the folder to
`./.mahou/` so the rebranded commands can find them:
```bash
mv ./.magic-pi ./.mahou
```

### What the installer does

1. Copies `references/` to `~/.config/opencode/mahou/references/`.
2. Copies `commands/*.md` to `~/.config/opencode/command/`, replacing
   `{{MAHOU_HOME}}` with the resolved absolute path (for `@`-include
   compatibility).
3. Nothing is downloaded from the internet. No dependencies required.

### Uninstall

```powershell
.\install.ps1 -Uninstall      # Windows
```
```bash
./install.sh --uninstall       # Unix
```

## Usage

### Typical workflow

```text
/mahou-new-project I want to build an e-commerce platform with React + Node + Postgres
/mahou-research --explore e-commerce architecture patterns
/mahou-brainstorm auth subsystem
/mahou-orchestrator ./.mahou/plans/<uuid>.md
/mahou-verify
/mahou-ship
```

If verify returns REPLAN, go back to brainstorm. If FIX_FORWARD, use
`/mahou-debug`.

### Quick start (single feature)

If you already have a project and just want to build one feature:

```text
/mahou-brainstorm I want to add a webhook system for real-time notifications
/mahou-orchestrator ./.mahou/plans/<uuid>.md
/mahou-verify
/mahou-ship
```

### Resume after restart

```text
/mahou-resume
/mahou-orchestrator ./.mahou/plans/<uuid>.md  ← resumes from last task
```

## Quick Reference

| Command | Purpose | Access |
|---|---|---|
| `/mahou` | List all mahou commands | read-only |
| `/mahou-new-project` | Initialize project — PROJECT.md + ROADMAP.md | full (.mahou/ only) |
| `/mahou-init` | Generate codebase map for existing projects | full (.mahou/ only) |
| `/mahou-research` | Internet research — explore, diagnose, or lookup | full (webfetch) |
| `/mahou-ask` | Answer questions / explain code without changes | read-only |
| `/mahou-debug` | Systematic root-cause debugging (4 phases) | full |
| `/mahou-review` | Code review of existing scope (discover, triage, verify, report) | read-only |
| `/mahou-brainstorm` | Design to spec to implementation plan | spec/plan writable |
| `/mahou-orchestrator` | Execute a plan task-by-task via subagents with two-stage review | read-only (delegates) |
| `/mahou-verify` | Verify implementation against spec — PASS, FIX_FORWARD, or REPLAN | read-only |
| `/mahou-resume` | Resume work from previous session with reconciliation | read-only |
| `/mahou-ship` | Push branch, create PR, filter .mahou/ artifacts | read-only + bash |

## Commands

### /mahou-ask

**What it does:** Answers questions and explains code without making any
changes.

**When to use:** When you want to understand how code works, trace logic, or
explore a codebase without risk of accidental edits.

**Process:** Direct answer — no phases. Reads the relevant code and explains
with specific file:line references. If the question is ambiguous, asks for
clarification first. If you ask it to make changes, it redirects you to
`/mahou-debug`, `/mahou-brainstorm`, or the build agent.

**Tools & access:** Read-only — `read`, `bash`, `grep`, `glob`. No `edit` or
`write` tools are available.

**Examples:**

```text
/mahou-ask How does the retry logic in the HTTP client work?
/mahou-ask What does the PaymentService class depend on?
```

### /mahou-debug

**What it does:** Systematic root-cause debugging. Finds and fixes the root
cause, not the symptom.

**When to use:** Any technical issue — test failures, bugs, unexpected
behavior, performance problems, build failures, integration issues.

**Process:** Four phases, each completed before the next:

1. **Root Cause Investigation** — read error messages carefully, reproduce
   consistently, check recent changes (`git diff`, `git log`, `git bisect`),
   gather evidence at component boundaries, trace data flow backward to where
   bad values originate.
2. **Pattern Analysis** — find similar working code in the codebase, compare
   against the reference implementation, identify every difference.
3. **Hypothesis & Testing** — form a single hypothesis, test the smallest
   possible change, verify before continuing. If it doesn't work, form a new
   hypothesis — don't stack fixes.
4. **Implementation** — create a failing test case, implement a single fix at
   the root cause, verify, then harden with defense-in-depth and a regression
   test.

**Iron law:** No fixes without root cause investigation first. If you haven't
completed Phase 1, you cannot propose fixes.

**Tools & access:** Full — `read`, `write`, `edit`, `bash`, `grep`, `glob`,
`agent`. Investigation (Phases 1-3) is read-only; fixes (Phase 4) use
`edit`/`write`.

**Subagents:** Dispatches `explore` subagents (read-only) for Phase 1-2
investigation — locating failing code paths, mapping data flow, finding
working examples. Runs independent research questions in parallel.

**Examples:**

```text
/mahou-debug The auth tests are failing intermittently after the refactor
/mahou-debug Payment webhook returns 500 for amounts over $1000
```

### /mahou-review

**What it does:** Code review of an existing scope. Finds real issues, verifies
them independently, and reports only what survives verification.

**When to use:** When you want to review a module, feature, directory, or PR.
For a single specific bug, use `/mahou-debug` instead.

**Process:** Four phases:

1. **Discovery** — parse the scope, find relevant files, read each one, identify
   key responsibilities and dependencies. Dispatches `explore` subagents for
   broad areas. Detects UI surfaces and loads UI critique methodology if
   applicable.
2. **Triage** — lists potential issues across categories: Correctness (logic
   bugs, race conditions, dead code), Security (injection, auth bypass,
   secrets), Performance (N+1 queries, memory leaks, quadratic algorithms),
   Architecture (circular dependencies, god modules, tight coupling), and
   UI/UX (interaction states, cognitive load, AI slop, accessibility) when UI
   is in scope. No style or formatting nits.
3. **Verification** — for each issue, an independent `general` subagent reads
   the actual code and returns **CONFIRMED**, **REFUTED**, or **UNDETERMINED**.
   Verifiers are read-only by instruction. Dispatched in parallel. UI issues
   use two-assessment synthesis (design review + code inspection).
4. **Final Report** — reports only confirmed issues with evidence and fix
   suggestions. Refuted and undetermined issues are listed separately.

**Tools & access:** Read-only — `read`, `bash`, `grep`, `glob`, `agent`. No
`edit` or `write` tools are available.

**Examples:**

```text
/mahou-review src/services/payment/
/mahou-review Review the auth module for security issues
```

### /mahou-brainstorm

**What it does:** Turns a vague idea into a validated design spec and a detailed
implementation plan through collaborative dialogue — without touching the
codebase.

**When to use:** When designing a new feature or subsystem before
implementation.

**Process:** A 13-step checklist:

1. Explore project context — reads PROJECT.md, ROADMAP.md, prior dependent
   specs, research briefs, codebase map, relevant files, and recent commits.
2. Scope check — flag if the request spans multiple independent subsystems.
3. Ask clarifying questions, one at a time, multiple choice preferred.
4. Propose 2-3 approaches with trade-offs.
5. Present the design in sections, getting approval after each. Enumerate key
   states for UI features (default, empty, loading, error, success, edge
   cases). Run AI slop test for visual direction.
6. Write the spec to `./.mahou/specs/<uuid>.md`. Adaptive depth: compact
   form for clear requests, full structured form for ambiguous ones.
7. Spec self-review (unfilled tokens, consistency, scope, ambiguity).
8. User reviews the spec.
9. Write the implementation plan to `./.mahou/plans/<uuid>.md`.
10. Plan self-review.
11. User reviews the plan.
12. Update ROADMAP.md — set feature status to planned.
13. Hand off to `/mahou-orchestrator` or the build agent.

**Hard gate:** No code, scaffolding, or implementation action until the design
is presented AND approved. This applies to every request regardless of
perceived simplicity.

**Replan support:** If returning from `/mahou-verify` with a REPLAN verdict,
appends to the spec's revision log (round N+1) without overwriting prior
rounds. Revises only affected sections.

**Tools & access:** Full tool access in frontmatter (`read`, `write`, `edit`,
`bash`, `grep`, `glob`, `agent`). The command's prompt enforces read-only
behavior on the codebase — it may ONLY use `write`/`edit` on spec, plan, and
ROADMAP documents under `./.mahou/`.

**Example:**

```text
/mahou-brainstorm I want to add a webhook system for real-time notifications
```

Output is spec and plan files under `./.mahou/`, not code changes.

### /mahou-orchestrator

**What it does:** Executes an implementation plan task-by-task via subagents,
with two-stage review after each task.

**When to use:** When you have a plan (typically from `/mahou-brainstorm`) and
the tasks are mostly independent. For a single focused change, use the build
agent instead.

**Process:** Per-task cycle:

1. Capture the BASE_SHA (`git rev-parse HEAD`).
2. Dispatch an implementer subagent with the full task text pasted into the
   prompt (the subagent never reads the plan file).
3. Handle the implementer's status: **DONE**, **DONE_WITH_CONCERNS**,
   **BLOCKED**, or **NEEDS_CONTEXT**. On external unknowns, dispatches a
   research subagent with `webfetch` access.
4. Dispatch a spec compliance reviewer — verifies the implementer built what
   was requested, nothing more, nothing less. Loop until it passes.
5. Dispatch a code quality reviewer — verifies the implementation is clean,
   tested, and maintainable. Loop until Approved.
6. Mark the task complete, update state.json and ROADMAP.md.
7. Every N tasks (default 3): dispatch an integration reviewer to check seam
   bugs between tasks.

After all tasks: a final code review for the entire implementation, then
branch finish guidance.

**Two-stage review:** Spec compliance runs first (did they build what was
asked?), then code quality (is it well-built?). The order is mandatory — code
quality review does not start until spec compliance passes.

**Tools & access:** Read-only orchestrator — `read`, `bash`, `grep`, `glob`,
`agent`. No `edit` or `write` tools. Subagents handle all writes and commits.
May write to state.json and ROADMAP.md via bash.

**Model selection:** Cheap/fast models for mechanical tasks (1-2 files, clear
spec). Standard models for integration tasks (multi-file, pattern matching).
Most capable models for architecture, design, and review.

**Example:**

```text
/mahou-orchestrator ./.mahou/plans/<uuid>.md
```

**Integration:** Upstream from `/mahou-brainstorm` (produces the plan).
Downstream to `/mahou-verify` after all tasks pass review.

### /mahou-new-project

**What it does:** Initializes a new project with deep context gathering,
producing PROJECT.md (project context, architecture, conventions, decisions
log) and ROADMAP.md (feature breakdown, dependencies, build order, status
tracking).

**When to use:** Once per project, before any feature brainstorming. This
creates the project layer that all subsequent features reference.

**Tools & access:** Full — `read, write, bash, grep, glob, agent`. Writes
ONLY to `./.mahou/PROJECT.md` and `./.mahou/ROADMAP.md`.

**Example:**

```text
/mahou-new-project I want to build an e-commerce platform with React + Node + Postgres
```

### /mahou-init

**What it does:** Generates a codebase map (`./.mahou/map.md`) for an
existing project. Maps modules, responsibilities, dependencies, patterns,
and entry points. Does NOT generate AGENTS.md files (preserves zero
structural token cost).

**When to use:** Once per existing codebase, before working on features in
it. For new projects from scratch, use `/mahou-new-project` instead.

**Tools & access:** Full — `read, write, bash, grep, glob, agent`. Writes
ONLY to `./.mahou/map.md`.

### /mahou-research

**What it does:** Internet-connected research using Yahoo/Bing search via
the native `webfetch` tool. Three modes:

- `--explore` (default): broad comparative research. Dispatches 3-5
  subagents in parallel, each fetching 2-3 pages. Returns a synthesized
  brief saved to `./.mahou/research/<uuid>.md`.
- `--diagnose`: narrow deep-dive. Dispatches 1 subagent for a specific
  question (3-5 pages). Returns a targeted answer saved to
  `./.mahou/research/<uuid>.md`.
- `--lookup`: quick factual lookup. Direct fetch in main context (1 page,
  inline answer, no file saved).

**When to use:** Before `/mahou-brainstorm` to research approaches, or
during `/mahou-debug` to check how upstream code works.

**Tools & access:** Full — `read, bash, grep, glob, agent, webfetch`.
Heavy fetching happens inside isolated subagents (explore/diagnose) to keep
main context lean.

**Examples:**

```text
/mahou-research --explore compare Drizzle vs Prisma for Postgres
/mahou-research --diagnose why does SQLite WAL mode cause lock errors
/mahou-research --lookup what port does Express default to
```

### /mahou-verify

**What it does:** Verifies implementation against spec. Dispatches verifier
subagents per UAT criterion, synthesizes verdicts, and produces a routing
verdict: PASS, FIX_FORWARD (route to /mahou-debug), or REPLAN (route to
/mahou-brainstorm).

**When to use:** After `/mahou-orchestrator` completes all tasks for a
feature. This is the gate between implementation and shipping.

**Tools & access:** Read-only — `read, bash, grep, glob, agent`.

### /mahou-resume

**What it does:** Restores session context after restart. Reads state.json,
identifies the last in-progress task, runs git-diff reconciliation to detect
manual changes, and routes back to the orchestrator.

**When to use:** After restarting opencode mid-orchestration.

**Tools & access:** Read-only — `read, bash, grep, glob`.

### /mahou-ship

**What it does:** Pushes branch, creates PR with auto-generated body sourced
from spec, plan, state, and verification report. Filters `.mahou/`
planning artifacts from the PR diff.

**When to use:** After `/mahou-verify` returns PASS.

**Tools & access:** Read-only + bash — `read, bash, grep, glob`.

## Workflows

### Debug a bug

When something is broken, reach for `/mahou-debug`. It runs the 4-phase
discipline end-to-end — investigation, pattern analysis, hypothesis, fix, and
hardening.

```text
/mahou-debug The auth tests are failing intermittently after the refactor
```

### Design and build a feature

Start with `/mahou-brainstorm` to design, write a spec, and produce an
implementation plan. Once the plan is approved, run `/mahou-orchestrator` to
execute it task-by-task with two-stage review per task.

```text
/mahou-brainstorm I want to add a webhook system for real-time notifications
/mahou-orchestrator ./.mahou/plans/<uuid>.md
```

### Review existing code

Run `/mahou-review` on a scope to find verified issues. Confirmed correctness
bugs go to `/mahou-debug`; architecture findings needing design go to
`/mahou-brainstorm`; surgical fixes use the build agent.

```text
/mahou-review src/services/payment/
```

### Build a whole system from scratch

Start with `/mahou-new-project` to create the project layer, then
brainstorm/orchestrate/verify/ship each feature in dependency order.

```text
/mahou-new-project I want to build an e-commerce platform with React + Node + Postgres
/mahou-research --explore e-commerce architecture patterns
/mahou-brainstorm auth subsystem
/mahou-orchestrator ./.mahou/plans/<uuid>.md
/mahou-verify
/mahou-ship
/mahou-brainstorm product catalog  ← reads PROJECT.md + auth's spec
... repeat for each feature in ROADMAP build order ...
```

### Feedback loop (when verify finds issues)

```text
/mahou-verify
  → PASS: /mahou-ship
  → FIX_FORWARD: /mahou-debug (specific issue) → re-verify
  → REPLAN: /mahou-brainstorm (revises spec, appends revision log)
```

## Architecture

### Design invariants

These rules must not be violated by any command or reference:

1. **Zero structural token cost** — nothing auto-injects on every prompt;
   everything loads via `@`-include when invoked or inside subagent isolated
   context
2. **Tool-level read-only enforcement** — read-only commands omit `edit`/`write`
   in frontmatter
3. **No MCP, no npm, no plugins, no hooks, no telemetry** — pure markdown +
   native tools
4. **Subagent isolation for heavy work** — `webfetch` and large reads happen in
   `explore`/`general` subagents
5. **Feedback loops** — every downstream command has PASS / FIX_FORWARD / REPLAN
   return edges
6. **State on disk** — `state.json` written via bash, read only when needed
7. **UI principles gated behind UI detection** — non-UI projects pay zero cost
8. **Append-only specs** — replan appends revision log, doesn't overwrite
9. **Project layer above feature layer** — PROJECT.md + ROADMAP.md link features
   into a coherent system
10. **No AGENTS.md auto-generation** — `mahou-init` produces `map.md` only

### Artifact structure

```text
.mahou/
├── PROJECT.md          ← project context, architecture, conventions, decisions log
├── ROADMAP.md          ← feature breakdown, dependencies, build order, status
├── state.json          ← enriched session state (orchestrator, for resume)
├── map.md              ← codebase map (from /mahou-init, no AGENTS.md)
├── specs/              ← per-feature specs (linked from ROADMAP)
├── plans/              ← per-feature plans (linked from ROADMAP)
├── research/           ← research briefs (project-level + feature-level)
├── verify/             ← verification reports
└── postmortems/        ← post-mortems (Phase 2, directory reserved)
```

## Repository Structure

```text
mahou/
├── install.ps1
├── install.sh
├── commands/
│   ├── mahou.md
│   ├── mahou-ask.md
│   ├── mahou-brainstorm.md
│   ├── mahou-debug.md
│   ├── mahou-init.md
│   ├── mahou-new-project.md
│   ├── mahou-orchestrator.md
│   ├── mahou-research.md
│   ├── mahou-resume.md
│   ├── mahou-review.md
│   ├── mahou-ship.md
│   └── mahou-verify.md
├── references/
│   ├── code-quality-reviewer-prompt.md
│   ├── condition-based-waiting.md
│   ├── defense-in-depth.md
│   ├── find-polluter.sh
│   ├── git-workflow.md
│   ├── implementer-prompt.md
│   ├── integration-reviewer-prompt.md
│   ├── issue-verifier-prompt.md
│   ├── research-prompt.md
│   ├── root-cause-tracing.md
│   ├── spec-reviewer-prompt.md
│   ├── ui-critique.md
│   ├── ui-design.md
│   ├── verify-prompt.md
│   └── writing.md
└── README.md
```

## Contributing

PRs are welcome. This is a configuration package, not a library — changes should
preserve the design invariants listed in [Architecture](#architecture).

To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes — follow existing markdown conventions
4. Ensure no design invariants are violated
5. Submit a pull request

For questions or issues, please open a [GitHub issue](https://github.com/).

## License

Share freely. This is a configuration package, not a library.
