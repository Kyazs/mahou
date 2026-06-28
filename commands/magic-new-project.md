---
description: "Initialize a new project — deep context gathering, architecture, and roadmap"
argument-hint: "[project description or goal]"
tools:
  read: true
  write: true
  bash: true
  grep: true
  glob: true
  agent: true
---

<objective>
Initialize a new project through deep context gathering. Produces PROJECT.md
(project context, architecture, conventions, decisions log) and ROADMAP.md
(feature breakdown, dependencies, build order, status tracking).

This is the project layer that sits above the feature layer. Every subsequent
/magic-brainstorm reads PROJECT.md and ROADMAP.md to stay consistent across
features.
</objective>

<context>
User's project idea: $ARGUMENTS
</context>

<process>
### Phase 1: Deep Context Gathering

Ask questions ONE AT A TIME. Adapt based on answers. Don't dump them all at
once — have a natural dialogue.

1. **Project goal** — one sentence describing what this project is and does.
2. **Users** — who specifically uses this? (roles, context, frequency — not
   "users")
3. **Tech stack** — frontend, backend, database, infrastructure. What's
   decided vs. open?
4. **Key constraints** — budget, timeline, scale, regulatory, team size.
5. **Success criteria** — how will you know this project is working? What
   does "done" look like?

If $ARGUMENTS already contains enough detail to answer some of these, assert
the answer and ask for confirmation rather than re-asking.

### Phase 2: Architecture Overview

Based on the context gathered:

1. **High-level component map** — what are the major components and how do
   they connect? (e.g., "React frontend → Express API → PostgreSQL database
   → Redis cache")
2. **Data model sketch** — what are the core entities and their relationships?
   (e.g., "User has many Orders, Order has many LineItems")
3. **API conventions** — REST or GraphQL? Auth strategy? Error response
   format? Naming conventions?
4. **Shared patterns** — error handling, validation, state management,
   testing approach.

Present this to the user and get approval before proceeding.

### Phase 3: Subsystem Decomposition

Break the project into independent subsystems/features:

1. List all subsystems (e.g., auth, catalog, cart, checkout, payment, admin,
   notifications).
2. Map dependencies between them (e.g., "catalog needs auth," "checkout needs
   cart + payment").
3. Determine build order — dependency-safe topological sort. Features with no
   dependencies come first.
4. For each subsystem: name, one-sentence description, dependencies, status
   (pending).

If the project can't be decomposed (single monolith), flag it. Ask the user
whether to force a single-feature plan or reconsider the scope.

### Phase 4: Write PROJECT.md

Write to `./.magic-pi/PROJECT.md`:

```markdown
# Project: [Name]

**Goal:** [one sentence]
**Started:** [date]
**Tech Stack:** [frontend, backend, database, infra]

## Architecture Overview

[Component map, data model sketch, API conventions, shared patterns]

## Conventions

- **Naming:** [file naming, function naming, variable naming]
- **API patterns:** [REST/GraphQL, auth strategy, error format]
- **Error handling:** [approach]
- **Validation:** [approach]
- **Testing:** [framework, TDD?, coverage expectations]

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| [date] | [what was decided] | [why] |
```

### Phase 5: Write ROADMAP.md

Write to `./.magic-pi/ROADMAP.md`:

```markdown
# Project Roadmap: [Name]

**Project:** ./.magic-pi/PROJECT.md
**Started:** [date]
**Status:** In Progress (0/N features complete)

## Feature Breakdown

### Phase 1: Foundation
| # | Feature | Spec | Plan | Status | Depends On |
|---|---------|------|------|--------|------------|
| 1 | [name] | — | — | pending | — |
| 2 | [name] | — | — | pending | 1 |

### Phase 2: [Phase name]
| # | Feature | Spec | Plan | Status | Depends On |
|---|---------|------|------|--------|------------|
| 3 | [name] | — | — | pending | 1, 2 |

## Build Order (dependency-safe)
1 → 2 → 3 → ...

## Decisions Log
- [date]: [decision] — [rationale]
```

### Phase 6: Route

Tell the user:

> Project initialized. PROJECT.md and ROADMAP.md written to `./.magic-pi/`.
> Run `/magic-brainstorm [first feature name]` to start designing the first
> feature.
</process>

<error_handling>
- **Ambiguous goal:** Ask clarifying questions until the goal is concrete
  enough to decompose into subsystems.
- **Can't decompose (single monolith):** Flag it. Ask whether to force a
  single-feature plan or reconsider scope.
- **User cancels mid-interview:** Save partial PROJECT.md with an "incomplete"
  marker so /magic-brainstorm or a later /magic-new-project can continue.
</error_handling>

<restrictions>
- This command writes ONLY to `./.magic-pi/PROJECT.md` and
  `./.magic-pi/ROADMAP.md`. It does not touch the codebase.
- Do NOT generate AGENTS.md files — opencode auto-reads them, which would
  create permanent per-prompt token cost.
</restrictions>

<references>
@{{MAGIC_PI_HOME}}/references/git-workflow.md
</references>
