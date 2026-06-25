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
  ones with `edit`), and on `./.magic-pi/ROADMAP.md` for status updates.
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

1. **Explore project context**:
   a. Read `./.magic-pi/PROJECT.md` (project goal, tech stack, conventions,
      decisions) — if it doesn't exist, tell the user to run
      /magic-new-project first (or proceed in feature-at-a-time mode for a
      one-off feature).
   b. Read `./.magic-pi/ROADMAP.md` (which feature is this, what depends on
      it, what features are already done).
   c. Read specs of completed/prior features that this one depends on (from
      ROADMAP dependency list).
   d. Read `./.magic-pi/research/*.md` briefs relevant to this feature.
   e. Read `./.magic-pi/map.md` if it exists (codebase memory).
   f. Read relevant files, docs, and recent commits (`git log --oneline -20`,
      `git diff`). Understand the architecture before asking anything.

1a. **UI detection** — if the feature involves a user interface:
    @{{MAGIC_PI_HOME}}/references/ui-design.md
    Add UI discovery questions to step 3:
      - Purpose & context (who specifically, state of mind, success criteria)
      - Content & data (realistic ranges: min/typical/max, edge cases)
      - Design direction (color strategy, theme scene sentence, anchor
        references, register: brand vs product)
      - Anti-goals (what NOT to be)
    In step 5, enumerate key states (default, empty, loading, error, success,
    edge cases).
    In step 5, run AI slop test against any visual direction proposed.
    If no UI: skip entirely, zero token cost.

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
   **Adaptive depth:** When the request is clear and context pins
   scope/direction, use compact spec form (3-5 bullets). When ambiguous or
   multi-screen, use the full structured form. Don't pad a clear spec to
   look thorough.

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

12. **Update ROADMAP** -- update `./.magic-pi/ROADMAP.md`: set this feature's
    status to `planned`, fill in the spec and plan paths.

13. **Transition** -- tell the user to run `/magic-orchestrator` to execute the
    plan via subagents, or use the build agent to implement directly.
</checklist>

<replan_support>
If returning from /magic-verify with a REPLAN verdict:
- Read the existing spec (including any revision log).
- Read the verify report (what failed and why).
- Append to the spec's revision log (round N+1). Do NOT overwrite round N.
  The revision log section tracks what changed and why across replan rounds.
- Revise only the affected sections, not the entire spec.
- Update ROADMAP.md: feature status → `replanned`, increment revision count.
- Then proceed through the normal checklist from step 9 (write new/amended
  plan) onward.
</replan_support>

<error_handling>
- **PROJECT.md doesn't exist:** Tell user to run /magic-new-project first (or
  proceed in feature-at-a-time mode for a one-off feature).
- **Prior dependent spec missing:** If ROADMAP says this feature depends on
  another feature, but that feature's spec doesn't exist in ./.magic-pi/specs/,
  flag the inconsistency. Ask the user to verify the ROADMAP or brainstorm the
  dependency first.
- **User rejects design 3+ times:** Stop proposing new designs. Ask "what's
  the core disagreement?" and restart from the user's framing of the problem.
- **Replan mode but no revision log in spec:** Create the revision log section
  in the spec. Note "Round 1 was the original spec. This is round 2." Then
  proceed with the replan.
</error_handling>

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
