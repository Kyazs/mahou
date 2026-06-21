# magic-pi-opencode

A portable, shareable set of opencode slash commands ported from the
[magic-pi](https://github.com/) pi agent configuration. Brings five disciplined
workflows into opencode — ask, debug, review, brainstorm, orchestrator — as
slash commands you run like `/magic-debug`, `/magic-review`, etc.

No plugins, no MCP servers, no npm dependencies. Just markdown command files
and reference docs.

## Why use these commands

opencode ships built-in `plan` and `build` agents that do the work. magic-pi
commands enforce *how* the work is done:

- **`/magic-debug`** — 4-phase root-cause debugging. No fixes before
  investigation is complete.
- **`/magic-review`** — read-only code review with per-issue verification
  subagents. Only confirmed issues reach the report.
- **`/magic-brainstorm`** — design to spec to plan. No code or scaffolding
  until the design is approved.
- **`/magic-orchestrator`** — execute a plan task-by-task with two-stage
  review (spec compliance, then code quality) after each task.
- **`/magic-ask`** — read-only explanation mode that can't accidentally mutate
  your code.

`plan` and `build` are not duplicated — magic-pi complements them.

## How it works

Each command is a markdown file with YAML frontmatter. opencode reads the
frontmatter to register the slash command and enforce tool access. The body
becomes the command's prompt.

- **Tool access is enforced, not requested.** The `tools:` frontmatter lists
  which tools a command may use. Read-only commands (`magic-ask`,
  `magic-review`, `magic-orchestrator`) simply omit `write`/`edit` — opencode
  blocks mutations at the tool level, not just by prompt instruction.
- **Reference docs load via `@`-includes.** Command bodies use
  `@{{MAGIC_PI_HOME}}/references/<file>.md` to pull in technique guides and
  subagent prompt templates. The placeholder is resolved to an absolute path
  at install time.
- **No runtime dependencies.** Everything is static markdown. Nothing is
  downloaded from the internet.

## Install

### Windows (PowerShell)

```powershell
cd magic-pi-opencode
.\install.ps1
```

### macOS / Linux (bash)

```bash
cd magic-pi-opencode
chmod +x install.sh
./install.sh
```

**After install, restart opencode** for the new commands to appear.

### What the installer does

1. Copies `references/` to `~/.config/opencode/magic-pi/references/`.
2. Copies `commands/*.md` to `~/.config/opencode/command/`, replacing
   `{{MAGIC_PI_HOME}}` with the resolved absolute path (for `@`-include
   compatibility).
3. Nothing is downloaded from the internet. No dependencies required.

### Uninstall

```powershell
.\install.ps1 -Uninstall      # Windows
```
```bash
./install.sh --uninstall       # Unix
```

## Quick reference

| Command | Purpose | Access |
|---|---|---|
| `/magic` | List all magic-pi commands | read-only |
| `/magic-ask` | Answer questions / explain code without changes | read-only |
| `/magic-debug` | Systematic root-cause debugging (4 phases) | full |
| `/magic-review` | Code review of existing scope (discover, triage, verify, report) | read-only |
| `/magic-brainstorm` | Design to spec to implementation plan | spec/plan writable |
| `/magic-orchestrator` | Execute a plan task-by-task via subagents with two-stage review | read-only (delegates) |

Detailed coverage of each command is in the next section.

## Commands

### /magic-ask

**What it does:** Answers questions and explains code without making any
changes.

**When to use:** When you want to understand how code works, trace logic, or
explore a codebase without risk of accidental edits.

**Process:** Direct answer — no phases. Reads the relevant code and explains
with specific file:line references. If the question is ambiguous, asks for
clarification first. If you ask it to make changes, it redirects you to
`/magic-debug`, `/magic-brainstorm`, or the build agent.

**Tools & access:** Read-only — `read`, `bash`, `grep`, `glob`. No `edit` or
`write` tools are available.

**Examples:**

```text
/magic-ask How does the retry logic in the HTTP client work?
/magic-ask What does the PaymentService class depend on?
```

### /magic-debug

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
/magic-debug The auth tests are failing intermittently after the refactor
/magic-debug Payment webhook returns 500 for amounts over $1000
```

### /magic-review

**What it does:** Code review of an existing scope. Finds real issues, verifies
them independently, and reports only what survives verification.

**When to use:** When you want to review a module, feature, directory, or PR.
For a single specific bug, use `/magic-debug` instead.

**Process:** Four phases:

1. **Discovery** — parse the scope, find relevant files, read each one, identify
   key responsibilities and dependencies. Dispatches `explore` subagents for
   broad areas.
2. **Triage** — lists potential issues across four categories: Correctness
   (logic bugs, race conditions, dead code), Security (injection, auth bypass,
   secrets), Performance (N+1 queries, memory leaks, quadratic algorithms),
   Architecture (circular dependencies, god modules, tight coupling). No style
   or formatting nits.
3. **Verification** — for each issue, an independent `general` subagent reads
   the actual code and returns **CONFIRMED**, **REFUTED**, or **UNDETERMINED**.
   Verifiers are read-only by instruction. Dispatched in parallel.
4. **Final Report** — reports only confirmed issues with evidence and fix
   suggestions. Refuted and undetermined issues are listed separately.

**Tools & access:** Read-only — `read`, `bash`, `grep`, `glob`, `agent`. No
`edit` or `write` tools are available.

**Examples:**

```text
/magic-review src/services/payment/
/magic-review Review the auth module for security issues
```

### /magic-brainstorm

**What it does:** Turns a vague idea into a validated design spec and a detailed
implementation plan through collaborative dialogue — without touching the
codebase.

**When to use:** When designing a new feature or subsystem before
implementation.

**Process:** A 12-step checklist:

1. Explore project context (files, docs, recent commits).
2. Scope check — flag if the request spans multiple independent subsystems.
3. Ask clarifying questions, one at a time, multiple choice preferred.
4. Propose 2-3 approaches with trade-offs.
5. Present the design in sections, getting approval after each.
6. Write the spec to `./.magic-pi/specs/<uuid>.md`.
7. Spec self-review (placeholders, consistency, scope, ambiguity).
8. User reviews the spec.
9. Write the implementation plan to `./.magic-pi/plans/<uuid>.md`.
10. Plan self-review.
11. User reviews the plan.
12. Hand off to `/magic-orchestrator` or the build agent.

**Hard gate:** No code, scaffolding, or implementation action until the design
is presented AND approved. This applies to every request regardless of
perceived simplicity.

**Tools & access:** Full tool access in frontmatter (`read`, `write`, `edit`,
`bash`, `grep`, `glob`, `agent`). The command's prompt enforces read-only
behavior on the codebase — it may ONLY use `write`/`edit` on spec and plan
documents under `./.magic-pi/specs/` and `./.magic-pi/plans/`. Unlike
`magic-ask`, `magic-review`, and `magic-orchestrator` (where read-only access
is enforced at the tool level), this is a prompt-level constraint.

**Example:**

```text
/magic-brainstorm I want to add a webhook system for real-time notifications
```

Output is spec and plan files under `./.magic-pi/`, not code changes.

### /magic-orchestrator

**What it does:** Executes an implementation plan task-by-task via subagents,
with two-stage review after each task.

**When to use:** When you have a plan (typically from `/magic-brainstorm`) and
the tasks are mostly independent. For a single focused change, use the build
agent instead.

**Process:** Per-task cycle:

1. Capture the BASE_SHA (`git rev-parse HEAD`).
2. Dispatch an implementer subagent with the full task text pasted into the
   prompt (the subagent never reads the plan file).
3. Handle the implementer's status: **DONE**, **DONE_WITH_CONCERNS**,
   **BLOCKED**, or **NEEDS_CONTEXT**.
4. Dispatch a spec compliance reviewer — verifies the implementer built what
   was requested, nothing more, nothing less. Loop until it passes.
5. Dispatch a code quality reviewer — verifies the implementation is clean,
   tested, and maintainable. Loop until Approved.
6. Mark the task complete and move to the next.

After all tasks: a final code review for the entire implementation, then
branch finish guidance.

**Two-stage review:** Spec compliance runs first (did they build what was
asked?), then code quality (is it well-built?). The order is mandatory — code
quality review does not start until spec compliance passes.

**Tools & access:** Read-only orchestrator — `read`, `bash`, `grep`, `glob`,
`agent`. No `edit` or `write` tools. Subagents handle all writes and commits.

**Model selection:** Cheap/fast models for mechanical tasks (1-2 files, clear
spec). Standard models for integration tasks (multi-file, pattern matching).
Most capable models for architecture, design, and review.

**Example:**

```text
/magic-orchestrator ./.magic-pi/plans/<uuid>.md
```

**Integration:** Upstream from `/magic-brainstorm` (produces the plan).
Downstream to the build agent for small follow-ups after all tasks pass
review.

## Workflows

### Debug a bug

When something is broken, reach for `/magic-debug`. It runs the 4-phase
discipline end-to-end — investigation, pattern analysis, hypothesis, fix, and
hardening.

```text
/magic-debug The auth tests are failing intermittently after the refactor
```

### Design and build a feature

Start with `/magic-brainstorm` to design, write a spec, and produce an
implementation plan. Once the plan is approved, run `/magic-orchestrator` to
execute it task-by-task with two-stage review per task.

```text
/magic-brainstorm I want to add a webhook system for real-time notifications
/magic-orchestrator ./.magic-pi/plans/<uuid>.md
```

### Review existing code

Run `/magic-review` on a scope to find verified issues. Confirmed correctness
bugs go to `/magic-debug`; architecture findings needing design go to
`/magic-brainstorm`; surgical fixes use the build agent.

```text
/magic-review src/services/payment/
```

## Repo structure

```text
magic-pi-opencode/
├── install.ps1                          # Windows installer
├── install.sh                           # Unix installer
├── commands/                            # 6 slash command definitions
│   ├── magic.md                         # /magic — lists all commands
│   ├── magic-ask.md                     # /magic-ask
│   ├── magic-debug.md                   # /magic-debug
│   ├── magic-review.md                  # /magic-review
│   ├── magic-brainstorm.md              # /magic-brainstorm
│   └── magic-orchestrator.md            # /magic-orchestrator
├── references/                          # supporting docs loaded by commands via @-includes
│   ├── root-cause-tracing.md            # tracing bad values backward to their origin (magic-debug)
│   ├── defense-in-depth.md              # hardening guidance for after a fix (magic-debug)
│   ├── condition-based-waiting.md       # replacing arbitrary timeouts with condition checks (magic-debug)
│   ├── find-polluter.sh                 # bisection script for test-polluter flakiness (magic-debug)
│   ├── writing.md                       # implementation-plan writing guide (magic-brainstorm)
│   ├── implementer-prompt.md            # subagent prompt template for task implementation (magic-orchestrator)
│   ├── spec-reviewer-prompt.md          # subagent prompt template for spec compliance review (magic-orchestrator)
│   ├── code-quality-reviewer-prompt.md  # subagent prompt template for code quality review (magic-orchestrator)
│   └── issue-verifier-prompt.md         # subagent prompt template for per-issue verification (magic-review)
└── README.md
```

## Requirements

- [opencode](https://opencode.ai) installed and working
- That's it. No npm dependencies, no plugins, no MCP servers.

## License

Share freely. This is a configuration package, not a library.
