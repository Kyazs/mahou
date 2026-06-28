---
description: "Generate codebase map — module inventory, patterns, entry points (no AGENTS.md)"
argument-hint: "[directory to map, defaults to current directory]"
tools:
  read: true
  write: true
  bash: true
  grep: true
  glob: true
  agent: true
---

<objective>
Generate a codebase map for an existing project. Produces a single map.md
file that subsequent commands and explore subagents can reference for
codebase memory — without the per-prompt token cost of AGENTS.md auto-injection.

This is for existing codebases. For new projects from scratch, use
/mahou-new-project instead.
</objective>

<context>
Directory to map: $ARGUMENTS (defaults to current directory if empty)
</context>

<critical_constraint>
Do NOT generate AGENTS.md files. opencode natively auto-reads AGENTS.md from
the directory tree, which would create permanent per-prompt token cost. The
map.md file is loaded ONLY when commands explicitly read it or when explore
subagents read it as their first step in isolated context. This preserves
the zero-structural-cost invariant.
</critical_constraint>

<process>
### Phase 1: Parallel Discovery

Dispatch 2-3 explore subagents in parallel, each covering a section of the
codebase:

- **Subagent 1: Directory structure and entry points**
  - Scan the top-level directory structure
  - Identify entry points (main files, index files, app bootstrap)
  - Identify configuration files (package.json, tsconfig, etc.)
  - Note the overall project layout

- **Subagent 2: Core modules and responsibilities**
  - Identify the main modules/packages/directories
  - For each, read a representative file to understand its responsibility
  - Note key patterns (how modules export, how they're imported)
  - Identify shared utilities and common code

- **Subagent 3: Dependencies and data flow**
  - Identify external dependencies (from package.json, import statements)
  - Trace key data flows (request → handler → model → response)
  - Identify the database/ORM layer, API layer, UI layer
  - Note conventions (error handling, validation, testing patterns)

### Phase 2: Synthesize

Combine subagent findings into a single map. Read the actual files they point
at to verify their claims — trust but verify.

### Phase 3: Write map.md

Write to `./.mahou/map.md`:

```markdown
# Codebase Map

**Generated:** [date]
**Project:** [name from package.json or directory]

## Module Inventory

| Module | Path | Responsibility | Key Dependencies |
|--------|------|----------------|-----------------|
| [name] | [path] | [one-sentence responsibility] | [what it depends on] |

## Entry Points

- [file path] — [what it does]

## Key Patterns

- **Module pattern:** [how modules are structured and exported]
- **Error handling:** [approach]
- **Validation:** [approach]
- **Testing:** [framework, location of tests, naming convention]
- **State management:** [if applicable]

## External Dependencies

- [dependency] — [what it's used for]

## Data Flow

[Brief description of how data moves through the system]

## Conventions

- [naming, file organization, API patterns, etc.]
```

### Phase 4: Report

Tell the user:

> Codebase map written to `./.mahou/map.md`. Subsequent commands
> (/mahou-brainstorm, /mahou-orchestrator, /mahou-review) will reference
> this for codebase context. Explore subagents will read it as their first
> step.
</process>

<error_handling>
- **No code found:** If the directory has no source files, report "no
  codebase detected" and suggest checking the directory path.
- **Very large codebase:** If the codebase is very large (500+ files), narrow
  scope to the most important directories. Ask the user which areas to focus
  on.
- **Subagent findings conflict:** Read the actual files to resolve
  discrepancies. Don't guess.
</error_handling>

<restrictions>
- Do NOT generate AGENTS.md files anywhere in the directory tree.
- Write ONLY to `./.mahou/map.md`.
- The map is a reference, not a comprehensive code analysis. Keep it
  high-level — module inventory and patterns, not line-by-line documentation.
</restrictions>
