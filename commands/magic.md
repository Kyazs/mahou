---
description: "magic-pi commands: ask, debug, review, brainstorm, orchestrator"
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
| `/magic-ask` | Answer questions / explain code without changes | read-only |
| `/magic-debug` | Systematic root-cause debugging (4 phases) | full |
| `/magic-review` | Code review of existing scope (discover, triage, verify, report) | read-only |
| `/magic-brainstorm` | Design to spec to implementation plan | spec/plan writable |
| `/magic-orchestrator` | Execute a plan task-by-task via subagents with two-stage review | read-only (delegates) |

</commands>

<process>
If $ARGUMENTS is provided and matches a command name (ask, debug, review, brainstorm, orchestrator), tell the user to run `/magic-$ARGUMENTS` with their task description.

If $ARGUMENTS is empty, display the table above and ask which command they'd like to use.
</process>
