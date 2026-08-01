---
description: "mahou commands: new-project, init, research, ask, debug, review, brainstorm, designer, orchestrator, ultracode, verify, secure, resume, ship, postmortem"
argument-hint: "[command] or run without args for a list"
---

<objective>
List all available mahou commands with descriptions. If an argument is provided, route to that command.
</objective>

<commands>

| Command | Purpose | Access |
|---|---|---|
| `/mahou-new-project` | Initialize project — PROJECT.md + ROADMAP.md | full (writes to .mahou/ only) |
| `/mahou-init` | Generate codebase map for existing projects | full (writes to .mahou/ only) |
| `/mahou-research` | Internet research — explore, diagnose, or lookup | full (webfetch) |
| `/mahou-ask` | Answer questions / explain code without changes | read-only |
| `/mahou-debug` | Systematic root-cause debugging (4 phases) | full |
| `/mahou-review` | Code review of existing scope (discover, triage, verify, report) | read-only |
| `/mahou-brainstorm` | Design to spec to implementation plan | spec/plan writable |
| `/mahou-designer` | Design and ship production-grade frontend interfaces | full |
| `/mahou-orchestrator` | Execute a plan task-by-task via subagents with two-stage review | read-only (delegates) |
| `/mahou-ultracode` | Max-effort execution via large-scale parallel subagent waves | full |
| `/mahou-verify` | Verify implementation against spec — PASS, FIX_FORWARD, or REPLAN | read-only |
| `/mahou-secure` | Security verification of a change — PASS, FIX, or ESCALATE | read-only |
| `/mahou-resume` | Resume work from previous session with reconciliation | read-only |
| `/mahou-ship` | Push branch, create PR, filter .mahou/ artifacts | read-only + bash |
| `/mahou-postmortem` | Write a post-mortem for a resolved incident | .mahou/ only |

</commands>

<process>
If $ARGUMENTS is provided and matches a command name (new-project, init,
research, ask, debug, review, brainstorm, designer, orchestrator, ultracode,
verify, secure, resume, ship, postmortem), tell the user to run
`/mahou-$ARGUMENTS` with their task description.

If $ARGUMENTS is empty, display the table above and ask which command they'd
like to use.

**Typical workflow:**
1. `/mahou-new-project` — initialize project (once per project)
2. `/mahou-research` — research approaches (optional, before brainstorm)
3. `/mahou-brainstorm` — design a feature, produce spec + plan
4. `/mahou-orchestrator` — execute the plan task-by-task
5. `/mahou-verify` — verify implementation against spec
6. `/mahou-secure` — security verification (if the change is security-sensitive)
7. `/mahou-ship` — create PR and finish

If verify returns REPLAN, go back to step 3. If FIX_FORWARD, use /mahou-debug.
</process>
