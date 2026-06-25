# UI Critique Reference

Loaded by /magic-review via @-include ONLY when the review scope contains UI
surfaces (components, pages, styles, templates). Non-UI reviews skip this
entirely — zero token cost.

Distilled from the impeccable critique methodology. Principles, not scripts.

## When This Loads

The review agent loads this when step 1a detects UI surfaces in the review
scope. It adds a UI/UX triage category and changes Phase 3 verification to
use two-assessment synthesis for UI issues. If the scope has no UI, this file
is never read.

## Two-Assessment Synthesis

For UI issues, run two independent assessments, then synthesize (not
concatenate):

- **Assessment A: Design Review** — LLM evaluation using Nielsen heuristics
  and cognitive load checklist. Thinks like a design director.
- **Assessment B: Code Inspection** — Deterministic checks for interaction
  states, accessibility (contrast, keyboard nav, ARIA), and design system
  drift. Reads the actual code.

Dispatch as separate subagents. They must not see each other's output.

Synthesize: note where they agree, where B caught what A missed, and where
detector findings are false positives. Don't simply concatenate.

## Nielsen's 10 Heuristics

Score each heuristic 0-4. Be honest: a 4 means genuinely excellent.

### 1. Visibility of System Status
Keep users informed through timely, appropriate feedback.
- Check: loading indicators, action confirmation, progress indicators,
  current location, form validation feedback
- 0: no feedback | 4: every action confirms, progress always visible

### 2. Match Between System and Real World
Speak the user's language. Follow real-world conventions.
- Check: familiar terminology, logical order, recognizable icons, natural
  reading flow
- 0: pure tech jargon | 4: speaks user's language fluently

### 3. User Control and Freedom
Clear "emergency exit" from unwanted states.
- Check: undo/redo, cancel buttons, clear navigation back, easy filter clear
- 0: users get trapped | 4: undo, cancel, back, escape everywhere

### 4. Consistency and Standards
Same words, situations, and actions mean the same thing.
- Check: consistent terminology, same actions = same results, visual
  consistency, platform conventions
- 0: inconsistent everywhere | 4: fully consistent, predictable

### 5. Error Prevention
Design that prevents problems before they happen.
- Check: confirmation before destructive actions, input constraints, smart
  defaults, clear labels
- 0: errors easy to make | 4: errors nearly impossible

### 6. Recognition Rather Than Recall
Minimize memory load. Make options visible or easily retrievable.
- Check: visible options, contextual help, recent items, labeled icons
- 0: heavy memorization | 4: everything discoverable

### 7. Flexibility and Efficiency of Use
Accelerators invisible to novices, speeding up experts.
- Check: keyboard shortcuts, customization, bulk actions, power-user features
- 0: one rigid path | 4: highly flexible, customizable

### 8. Aesthetic and Minimalist Design
Interfaces should not contain irrelevant or rarely needed information.
- Check: only necessary info visible, clear hierarchy, purposeful color, no
  decorative clutter
- 0: overwhelming | 4: perfectly minimal, every element earns its pixel

### 9. Help Users Recognize, Diagnose, and Recover from Errors
Plain language, precise problem ID, constructive solution.
- Check: plain language errors, specific problem ID, actionable suggestions,
  errors near source, non-blocking
- 0: cryptic errors | 4: pinpoints issue, suggests fix, preserves work

### 10. Help and Documentation
Easy to find, task-focused, concise.
- Check: searchable help, contextual help, task-focused organization,
  scannable content
- 0: no help | 4: excellent contextual help at the right moment

### Score Summary

| Score Range | Rating | What It Means |
|-------------|--------|---------------|
| 36-40 | Excellent | Minor polish only; ship it |
| 28-35 | Good | Address weak areas, solid foundation |
| 20-27 | Acceptable | Significant improvements needed |
| 12-19 | Poor | Major UX overhaul required |
| 0-11 | Critical | Redesign needed; unusable |

Total possible: 40 points (10 heuristics x 4 max). Most real interfaces
score 20-32.

## Cognitive Load Checklist

Same 8 items as ui-design.md, used here as an assessment tool:

- [ ] Single focus (primary task without distraction)
- [ ] Chunking (<=4 items per group)
- [ ] Grouping (related items visually grouped)
- [ ] Visual hierarchy (immediately clear what's most important)
- [ ] One thing at a time (single decision before next)
- [ ] Minimal choices (<=4 visible options at decision point)
- [ ] Working memory (no info from previous screen needed)
- [ ] Progressive disclosure (complexity only when needed)

0-1 failures = low cognitive load (good). 2-3 = moderate. 4+ = critical.

## Persona-Based Design Testing

Select 2-3 personas most relevant to the interface type. Walk the primary
user action as each persona. Report specific red flags, not generic concerns.

### Alex — Impatient Power User
Expert with similar products. Expects efficiency, hates hand-holding.
- Red flags: forced tutorials, no keyboard nav, slow animations, one-item-
  at-a-time where batch is natural, redundant confirmations

### Jordan — Confused First-Timer
Never used this type of product. Needs guidance at every step.
- Red flags: icon-only navigation, technical jargon, no help option, ambiguous
  next steps, no action confirmation

### Sam — Accessibility-Dependent User
Uses screen reader, keyboard-only navigation. May have low vision.
- Red flags: click-only interactions, missing focus indicators, meaning by
  color alone, unlabeled fields, time-limited actions without extension

### Riley — Deliberate Stress Tester
Methodical user who pushes interfaces beyond the happy path.
- Red flags: features that silently fail, error handling that leaves UI
  broken, empty states with no guidance, data loss on refresh

### Casey — Distracted Mobile User
Using phone one-handed on the go. Frequently interrupted. Slow connection.
- Red flags: important actions at top of screen (unreachable by thumb), no
  state persistence, heavy assets, tiny tap targets

### Persona Selection by Interface Type

| Interface Type | Primary Personas | Why |
|---------------|-----------------|-----|
| Landing page / marketing | Jordan, Riley, Casey | First impressions, trust, mobile |
| Dashboard / admin | Alex, Sam | Power users, accessibility |
| E-commerce / checkout | Casey, Riley, Jordan | Mobile, edge cases, clarity |
| Onboarding flow | Jordan, Casey | Confusion, interruption |
| Data-heavy / analytics | Alex, Sam | Efficiency, keyboard nav |
| Form-heavy / wizard | Jordan, Sam, Casey | Clarity, accessibility, mobile |

## Issue Severity (P0-P3)

| Priority | Name | Description | Action |
|----------|------|-------------|--------|
| **P0** | Blocking | Prevents task completion entirely | Fix immediately |
| **P1** | Major | Causes significant difficulty or confusion | Fix before release |
| **P2** | Minor | Annoyance, but workaround exists | Fix in next pass |
| **P3** | Polish | Nice-to-fix, no real user impact | Fix if time permits |

If unsure between two levels, ask: "Would a user contact support about this?"
If yes, it's at least P1.

## Report Format

Present the full critique in this structure (in chat, not just a file):

1. **Design Health Score** — Nielsen 10 heuristic scores as a table, total
   /40, rating band
2. **Anti-Patterns Verdict** — does this look AI-generated? Check all absolute
   bans from ui-design.md
3. **Overall Impression** — brief gut reaction: what works, what doesn't,
   single biggest opportunity
4. **What's Working** — 2-3 specific things done well
5. **Priority Issues** — 3-5 most impactful problems, P0-P3 tagged, with fix
   and suggested magic-pi command
6. **Persona Red Flags** — per persona, specific elements/interactions that
   fail
7. **Minor Observations** — quick notes on smaller issues

Be direct. Vague feedback wastes time. Say what's wrong AND why it matters to
users. Give concrete suggestions. Prioritize ruthlessly.
