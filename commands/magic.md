---
description: "magic-pi commands: new-project, init, research, ask, debug, review, brainstorm, orchestrator, verify, resume, ship"
argument-hint: "[command] or run without args for a list"
tools:
  read: true
  bash: true
---

<objective>
List all available magic-pi commands with descriptions. If an argument is provided, route to that command.
</objective>

<commands>

| Command | Purpose | Access |
|---|---|---|
| `/magic-new-project` | Initialize project — PROJECT.md + ROADMAP.md | full (writes to .magic-pi/ only) |
| `/magic-init` | Generate codebase map for existing projects | full (writes to .magic-pi/ only) |
| `/magic-research` | Internet research — explore, diagnose, or lookup | full (webfetch) |
| `/magic-ask` | Answer questions / explain code without changes | read-only |
| `/magic-debug` | Systematic root-cause debugging (4 phases) | full |
| `/magic-review` | Code review of existing scope (discover, triage, verify, report) | read-only |
| `/magic-brainstorm` | Design to spec to implementation plan | spec/plan writable |
| `/magic-orchestrator` | Execute a plan task-by-task via subagents with two-stage review | read-only (delegates) |
| `/magic-verify` | Verify implementation against spec — PASS, FIX_FORWARD, or REPLAN | read-only |
| `/magic-resume` | Resume work from previous session with reconciliation | read-only |
| `/magic-ship` | Push branch, create PR, filter .magic-pi/ artifacts | read-only + bash |

</commands>

<process>
If $ARGUMENTS is provided and matches a command name (new-project, init,
research, ask, debug, review, brainstorm, orchestrator, verify, resume,
ship), tell the user to run `/magic-$ARGUMENTS` with their task description.

If $ARGUMENTS is empty, display the table above and ask which command they'd
like to use.

**Typical workflow:**
1. `/magic-new-project` — initialize project (once per project)
2. `/magic-research` — research approaches (optional, before brainstorm)
3. `/magic-brainstorm` — design a feature, produce spec + plan
4. `/magic-orchestrator` — execute the plan task-by-task
5. `/magic-verify` — verify implementation against spec
6. `/magic-ship` — create PR and finish

If verify returns REPLAN, go back to step 3. If FIX_FORWARD, use /magic-debug.
</process>
