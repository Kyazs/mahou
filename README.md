# magic-pi-opencode

A portable, shareable set of opencode agents ported from the
[magic-pi](https://github.com/) pi agent configuration. Brings magic-pi's
switchable agent modes (ask, debug, review, brainstorm, orchestrator) into
opencode as standalone agents you can switch to with `/agent`.

## What's included

Five agents that opencode doesn't ship built-in:

| Agent | Purpose | Access |
|---|---|---|
| `magic-ask` | Answer questions / explain code without changes | read-only |
| `magic-debug` | Systematic root-cause debugging (4 phases) | full |
| `magic-review` | Code review of existing scope (discover, triage, verify, report) | read-only |
| `magic-brainstorm` | Design to spec to implementation plan flow | spec/plan writable only |
| `magic-orchestrator` | Execute a plan task-by-task via subagents with two-stage review | read-only (delegates) |

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

**After install, restart opencode** for the new agents to appear in `/agent`.

### What the installer does

1. Copies `references/` to `~/.config/opencode/magic-pi/references/`
2. Copies `agents/*.md` to `~/.config/opencode/agents/`, replacing
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

Switch to an agent with opencode's `/agent` command:

```
/agent magic-debug
/agent magic-review
/agent magic-brainstorm
/agent magic-orchestrator
/agent magic-ask
```

Or start opencode with a specific agent:

```bash
opencode --agent magic-debug
```

### Workflows

**Debug a bug:**
```
/agent magic-debug
The auth tests are failing intermittently after the refactor
```

**Review a module:**
```
/agent magic-review
Review the payment service in src/services/payment/
```

**Design a feature:**
```
/agent magic-brainstorm
I want to add a webhook system for real-time notifications
```
(Produces spec + plan files under `./.magic-pi/`, then tells you to switch to
build or orchestrator.)

**Execute a plan:**
```
/agent magic-orchestrator
Execute the plan at ./.magic-pi/plans/<uuid>.md
```
(Dispatches implementer subagents per task with spec + code quality review
after each.)

**Ask a question:**
```
/agent magic-ask
How does the retry logic in the HTTP client work?
```

## Repo structure

```
magic-pi-opencode/
├── install.ps1              # Windows installer
├── install.sh               # Unix installer
├── agents/                  # 5 agent definitions (templates with {{MAGIC_PI_HOME}})
│   ├── magic-ask.md
│   ├── magic-debug.md
│   ├── magic-review.md
│   ├── magic-brainstorm.md
│   └── magic-orchestrator.md
├── references/              # supporting docs loaded by agents via @-includes
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

## How it maps from magic-pi

magic-pi is a [pi](https://github.com/earendil-works/pi-coding-agent) agent
config with switchable modes. This repo ports the mode content to opencode's
agent format:

| magic-pi mode | opencode agent | Key adaptations |
|---|---|---|
| `modes/ask.md` | `magic-ask.md` | `permission: { edit: deny }` enforces read-only |
| `modes/debug.md` | `magic-debug.md` | `@`-includes for technique docs; explore subagents replace pi's Explore + context-mode |
| `modes/review.md` | `magic-review.md` | `@`-include for verifier template; general subagents replace pi's general-purpose |
| `modes/brainstorm.md` | `magic-brainstorm.md` | `@`-include for writing skill; specs/plans to `./.magic-pi/` |
| `modes/orchestrator.md` | `magic-orchestrator.md` | References prompt templates; delegates to general subagents |

### Adaptations from pi to opencode

- `{{agent_dir}}/extensions/modes/skills/` -> `{{MAGIC_PI_HOME}}/references/`
  (resolved at install time)
- `{{agent_dir}}/pi-magics/` -> `./.magic-pi/` (per-project spec/plan store)
- `subagent_type: "Explore"` -> `subagent_type: "explore"`
- `subagent_type: "general-purpose"` -> `subagent_type: "general"`
- context-mode tools (`ctx_execute_file`, etc.) -> removed; use `read`/`grep`/`bash` + `task` subagents
- `/mode X` -> `/agent magic-X`
- `disabled-tools: edit, write` -> `permission: { edit: deny }` (enforced, not just prompted)
- `thinking: high` -> dropped (opencode uses model variants, not agent-level thinking)

## Requirements

- [opencode](https://opencode.ai) installed and working
- That's it. No npm dependencies, no plugins, no MCP servers.

## License

Share freely. This is a configuration package, not a library.
