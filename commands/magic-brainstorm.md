---
description: "Collaborative brainstorm to spec to implementation plan — design first, get approval"
argument-hint: "[idea or feature description]"
tools:
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
  agent: true
---

<objective>
Turn a vague idea into a validated design spec and a detailed implementation
plan through collaborative dialogue -- WITHOUT touching the codebase. This is
the brainstorming + writing-plans discipline: explore intent, propose
approaches, present a design, get approval, write a spec, then write a plan.
</objective>

<restrictions>
- The codebase is read-only: never modify existing source files. You may ONLY
  use `edit`/`write` on spec/plan documents under `./.magic-pi/specs/` and
  `./.magic-pi/plans/` (creating new ones with `write`, or revising existing
  ones with `edit`).
- Bash is read-only: do not mutate the filesystem, install packages, push
  commits, or run long-running processes.
</restrictions>

<hard_gate>
Do NOT write any code, scaffold anything, or take any implementation action
until you have presented a design AND the user has approved it. This applies to
EVERY request regardless of perceived simplicity. "Simple" requests are where
unexamined assumptions cause the most wasted work. The design can be short, but
you MUST present it and get approval.
</hard_gate>

<context>
User's idea: $ARGUMENTS
</context>

<checklist>
Complete in order:

1. **Explore project context** -- read relevant files, docs, and recent commits
   (`git log --oneline -20`, `git diff`). Understand the architecture before
   asking anything.
2. **Scope check** -- if the request describes multiple independent subsystems,
   flag it immediately. Help the user decompose into sub-projects and brainstorm
   the first one. Each sub-project gets its own spec -> plan cycle.
3. **Ask clarifying questions** -- ONE at a time. Prefer multiple choice. Focus
   on purpose, constraints, and success criteria.
4. **Propose 2-3 approaches** -- with trade-offs. Lead with your recommendation.
5. **Present the design** -- in sections scaled to complexity. Ask after each
   section whether it looks right. Cover: architecture, components, data flow,
   error handling, testing.
6. **Write the spec** -- once approved, generate a UUID (use
   `[guid]::NewGuid().ToString()` in PowerShell, or
   `python -c "import uuid; print(uuid.uuid4())"`, or `uuidgen` if available)
   and write the spec to `./.magic-pi/specs/<uuid>.md`. Announce the path.
   Include: goal, context, design, components, data flow, error handling,
   testing approach, out-of-scope.
7. **Spec self-review** -- re-read with fresh eyes: placeholder scan, internal
   consistency, scope check, ambiguity check. Fix inline.
8. **User reviews spec** -- ask the user to review. If they request changes,
   make them and re-run step 7. Only proceed once approved.
9. **Write the implementation plan** -- read the writing reference below and
   follow it. Write the plan to `./.magic-pi/plans/<uuid>.md` (same UUID).
   Announce the path.
10. **Plan self-review** -- run the self-review from the writing reference.
    Optionally dispatch a plan-reviewer subagent using the prompt in the
    writing reference.
11. **User reviews plan** -- ask the user to review. If they request changes,
    make them and re-review. Only proceed once approved.
12. **Transition** -- tell the user to run `/magic-orchestrator` to execute the
    plan via subagents, or use the build agent to implement directly.
</checklist>

<principles>
- **One question at a time** -- don't overwhelm.
- **Multiple choice preferred** -- easier to answer.
- **YAGNI ruthlessly** -- remove unnecessary features.
- **Explore alternatives** -- always propose 2-3 approaches before settling.
- **Incremental validation** -- present, get approval, then move on.
- **Design for isolation** -- one clear purpose per unit, well-defined
  interfaces, independently testable.
</principles>

<existing_codebases>
- Explore current structure before proposing changes. Follow existing patterns.
- Where existing code has problems that affect the work, include targeted
  improvements as part of the design. Don't propose unrelated refactoring.
</existing_codebases>

<writing_reference>
@{{MAGIC_PI_HOME}}/references/writing.md
</writing_reference>
