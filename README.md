# magic-pi-opencode

A portable, shareable set of opencode commands ported from the
[magic-pi](https://github.com/) pi agent configuration. Brings magic-pi's
switchable agent modes (ask, debug, review, brainstorm, orchestrator) into
opencode as slash commands you run like `/magic-debug`, `/magic-review`, etc.

## What's included

Five commands that opencode doesn't ship built-in:

| Command | Purpose | Access |
|---|---|---|
| `/magic-ask` | Answer questions / explain code without changes | read-only |
| `/magic-debug` | Systematic root-cause debugging (4 phases) | full |
| `/magic-review` | Code review of existing scope (discover, triage, verify, report) | read-only |
| `/magic-brainstorm` | Design to spec to implementation plan flow | spec/plan writable only |
| `/magic-orchestrator` | Execute a plan task-by-task via subagents with two-stage review | read-only (delegates) |

Plus `/magic` which lists all available commands.

opencode's built-in `plan` and `build` agents already cover those workflows, so
they are not duplicated here.

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

1. Copies `references/` to `~/.config/opencode/magic-pi/references/`
2. Copies `commands/*.md` to `~/.config/opencode/command/`, replacing
   `{{MAGIC_PI_HOME}}` with the resolved absolute path (for `@`-include
   compatibility)

Nothing is downloaded from the internet. No dependencies required.

## Uninstall

```powershell
.\install.ps1 -Uninstall      # Windows
```
```bash
./install.sh --uninstall       # Unix
```

## Usage

Run a command with opencode's slash command interface:

```
/magic                      # list all magic-pi commands
/magic-debug                # systematic debugging
/magic-review               # code review
/magic-brainstorm           # design to spec to plan
/magic-orchestrator         # execute a plan via subagents
/magic-ask                  # explain code
```

Pass arguments after the command:

```
/magic-debug The auth tests are failing intermittently after the refactor
/magic-review src/services/payment/
/magic-brainstorm I want to add a webhook system for real-time notifications
/magic-orchestrator ./.magic-pi/plans/abc123.md
/magic-ask How does the retry logic in the HTTP client work?
```

### Workflows

**Debug a bug:**
```
/magic-debug The auth tests are failing intermittently after the refactor
```
Runs the 4-phase systematic debugging process: root cause investigation,
pattern analysis, hypothesis testing, implementation + hardening.

**Review a module:**
```
/magic-review Review the payment service in src/services/payment/
```
Runs the 4-phase code review: discovery, triage, verification (one subagent per
issue), final report. Only confirmed issues reach the report.

**Design a feature:**
```
/magic-brainstorm I want to add a webhook system for real-time notifications
```
Design to spec to plan flow. Produces spec + plan files under `./.magic-pi/`,
then tells you to run `/magic-orchestrator` to execute.

**Execute a plan:**
```
/magic-orchestrator ./.magic-pi/plans/<uuid>.md
```
Dispatches implementer subagents per task with spec compliance + code quality
review after each task.

**Ask a question:**
```
/magic-ask How does the retry logic in the HTTP client work?
```
Reads code and explains. No changes made.

## Repo structure

```
magic-pi-opencode/
├── install.ps1              # Windows installer
├── install.sh               # Unix installer
├── commands/                # 6 slash command definitions (templates with {{MAGIC_PI_HOME}})
│   ├── magic.md             # /magic — lists all commands
│   ├── magic-ask.md         # /magic-ask
│   ├── magic-debug.md       # /magic-debug
│   ├── magic-review.md      # /magic-review
│   ├── magic-brainstorm.md  # /magic-brainstorm
│   └── magic-orchestrator.md # /magic-orchestrator
├── references/              # supporting docs loaded by commands via @-includes
│   ├── root-cause-tracing.md
│   ├── defense-in-depth.md
│   ├── condition-based-waiting.md
│   ├── find-polluter.sh
│   ├── writing.md
│   ├── implementer-prompt.md
│   ├── spec-reviewer-prompt.md
│   ├── code-quality-reviewer-prompt.md
│   └── issue-verifier-prompt.md
└── README.md
```

## How it works

Commands are opencode's slash command system (same as GSD's `/gsd-*` commands).
Each command file in `commands/` has frontmatter with `description`, `tools`,
and `argument-hint`, plus a body that becomes the command's prompt. Commands
`@`-include reference files for supporting techniques and subagent prompt
templates.

Read-only commands (`magic-ask`, `magic-review`, `magic-orchestrator`) simply
don't declare `write`/`edit` in their `tools:` frontmatter -- opencode enforces
this at the tool level, not just by prompt instruction.

## How it maps from magic-pi

magic-pi is a [pi](https://github.com/earendil-works/pi-coding-agent) agent
config with switchable modes. This repo ports the mode content to opencode's
command format:

| magic-pi mode | opencode command | Key adaptations |
|---|---|---|
| `modes/ask.md` | `commands/magic-ask.md` | `tools:` frontmatter enforces read-only (no edit/write) |
| `modes/debug.md` | `commands/magic-debug.md` | `@`-includes for technique docs; explore subagents replace pi's Explore + context-mode |
| `modes/review.md` | `commands/magic-review.md` | `@`-include for verifier template; general subagents replace pi's general-purpose |
| `modes/brainstorm.md` | `commands/magic-brainstorm.md` | `@`-include for writing skill; specs/plans to `./.magic-pi/` |
| `modes/orchestrator.md` | `commands/magic-orchestrator.md` | References prompt templates; delegates to general subagents |

### Adaptations from pi to opencode

- `{{agent_dir}}/extensions/modes/skills/` -> `{{MAGIC_PI_HOME}}/references/`
  (resolved at install time)
- `{{agent_dir}}/pi-magics/` -> `./.magic-pi/` (per-project spec/plan store)
- `subagent_type: "Explore"` -> `subagent_type: "explore"`
- `subagent_type: "general-purpose"` -> `subagent_type: "general"`
- context-mode tools (`ctx_execute_file`, etc.) -> removed; use `read`/`grep`/`bash` + `task` subagents
- `/mode X` -> `/magic-X` (slash commands instead of mode switching)
- `disabled-tools: edit, write` -> `tools:` frontmatter (enforced by opencode)
- `thinking: high` -> dropped (opencode uses model variants, not command-level thinking)

## Requirements

- [opencode](https://opencode.ai) installed and working
- That's it. No npm dependencies, no plugins, no MCP servers.

## License

Share freely. This is a configuration package, not a library.
