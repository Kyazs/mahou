# UI Design Reference

Loaded by /magic-brainstorm via @-include ONLY when the feature involves a
user interface. Non-UI features skip this entirely — zero token cost.

Distilled from the impeccable design skill. Principles, not scripts.

## When This Loads

The brainstorm agent loads this when step 1a detects a UI surface. It adds
UI-specific discovery questions to the brainstorm process and a design-quality
checklist to the spec. If the feature has no UI, this file is never read.

## Discovery Interview (UI-specific questions)

Add these to the brainstorm's clarifying-questions step when UI is in scope.
Ask one at a time, adapting based on answers.

### Purpose &amp; Context
- Who specifically uses this? (role, context, frequency — not "users")
- What's the user's state of mind? (Rushed? Exploring? Anxious? Focused?)
- What does success look like? How will you know this feature is working?

### Content &amp; Data
- What content or data does this feature display or collect?
- What are the realistic ranges? (Minimum, typical, maximum — e.g., 0 items,
  5 items, 500 items)
- What are the edge cases? (Empty state, error state, first-time use, power
  user)
- Is any content dynamic? What changes and how often?

### Design Direction
Force a visual decision on three fronts:
- **Color strategy:** Restrained (tinted neutrals + one accent ≤10%) /
  Committed (one saturated color 30-60%) / Full palette (3-4 named roles) /
  Drenched (surface IS the color). Pick one.
- **Theme via scene sentence:** Write one sentence of physical context —
  who uses this, where, under what ambient light, in what mood. The sentence
  forces dark vs light. If it doesn't, add detail until it does.
- **Two or three named anchor references:** Specific products, brands, objects.
  Not adjectives like "modern" or "clean."

### Register
- Is this a **brand** surface (design IS the product — landing pages,
  portfolios, campaigns) or a **product** surface (design SERVES the product
  — dashboards, admin, tools)? Different rules apply.
  - Brand: display fonts, committed color, motion as personality
  - Product: one sans family, restrained color, motion conveys state only

### Anti-Goals
- What should this NOT be? What would be a wrong direction?
- What's the biggest risk of getting this wrong?

## Assert-Then-Confirm

When the answer is obvious from context, name it and ask the user to confirm
or override. Don't enumerate a menu with an escape hatch.

- Good: "This reads as Restrained, confirm?"
- Bad: "Restrained / Committed / Full palette / Drenched / something else?"

This reduces question fatigue without losing the confirmation gate.

## Adaptive Depth

- **Compact spec (3-5 bullets)** when the request is clear and context pins
  scope/direction. State what you're building, the visual lane, and end with
  a confirm prompt.
- **Full structured spec** when the task is ambiguous, multi-screen, or
  genuinely needs the discipline of structure.

Don't pad a clear spec into a long one to look thorough. A 70-line brief
restating answers the user just gave is noise, not rigor.

## Key States (must enumerate in every UI spec)

Every UI feature must enumerate these states in the spec. For each state,
note what the user sees and feels:

- **Default:** normal state with typical data
- **Empty:** first-time use, no data yet — teach the interface, don't just
  show blank space
- **Loading:** skeleton states, not spinners in the middle of content
- **Error:** clear message in plain language, actionable recovery path
- **Success:** confirmation of completed action
- **Edge cases:** very long content, very many items, slow connection, offline

## AI Slop Test

If someone could look at this interface and say "AI made that" without doubt,
it failed. Check for these absolute bans — match-and-refuse if found:

1. **Side-stripe borders.** `border-left` or `border-right` &gt; 1px as a colored
   accent on cards, list items, callouts. Rewrite with full borders, background
   tints, or leading numbers/icons.
2. **Gradient text.** `background-clip: text` + gradient background. Use a
   single solid color. Emphasize via weight or size.
3. **Glassmorphism as default.** Decorative blurs and glass cards. Rare and
   purposeful, or nothing.
4. **Hero-metric template.** Big number, small label, supporting stats,
   gradient accent. SaaS cliché.
5. **Identical card grids.** Same-sized cards with icon + heading + text,
   repeated endlessly.
6. **Tracked uppercase eyebrows above every section.** Small all-caps text
   with wide tracking ("ABOUT" "PROCESS" "PRICING"). One deliberate kicker
   as brand system is voice; eyebrows on every section is AI grammar.
7. **Numbered section markers as default scaffolding.** `01 · About / 02 ·
   Process` above every section. Numbers earn their place only when the
   section IS a sequence.
8. **Text that overflows its container.** Long heading words + large clamp
   scales + narrow grids = headline overflow on tablet/mobile. Test heading
   copy at every breakpoint.

## Interaction State Completeness

Every interactive component needs ALL of these states. Missing states =
broken experience:

- **Default:** resting state
- **Hover:** subtle feedback (color, scale, shadow)
- **Focus:** keyboard focus indicator (never remove without replacement)
- **Active:** click/tap feedback
- **Disabled:** clearly non-interactive
- **Loading:** async action feedback (skeleton, not spinner-in-content)
- **Error:** validation or error state
- **Success:** successful completion

## Cognitive Load Checklist

Evaluate the interface against these 8 items:

- [ ] **Single focus:** Can the user complete their primary task without
      distraction from competing elements?
- [ ] **Chunking:** Is information presented in digestible groups (≤4 items
      per group)?
- [ ] **Grouping:** Are related items visually grouped together (proximity,
      borders, shared background)?
- [ ] **Visual hierarchy:** Is it immediately clear what's most important?
- [ ] **One thing at a time:** Can the user focus on a single decision before
      moving to the next?
- [ ] **Minimal choices:** Are decisions simplified (≤4 visible options at
      any decision point)?
- [ ] **Working memory:** Does the user need to remember information from a
      previous screen to act on the current one?
- [ ] **Progressive disclosure:** Is complexity revealed only when the user
      needs it?

Scoring: 0-1 failures = low cognitive load (good). 2-3 = moderate (address
soon). 4+ = high cognitive load (critical fix needed).

## Color &amp; Contrast

- Body text must hit ≥4.5:1 contrast against its background (WCAG AA)
- Large text (≥18px or bold ≥14px) needs ≥3:1
- Placeholder text needs 4.5:1, not the muted-gray default
- Gray text on a colored background looks washed out. Use a darker shade of
  the background's own hue, or a transparency of the text color
- Use OKLCH for new projects
- Tinted neutrals: add 0.005-0.015 chroma toward the brand's hue. Don't
  default-tint toward warm or cool "because the brand feels that way"

## Typography

- Body line length: 65-75 characters
- Don't pair fonts that are similar but not identical (two geometric
  sans-serifs). Pair on a contrast axis (serif + sans, geometric + humanist)
  or use one family in multiple weights
- Hero / display heading ceiling: `clamp()` max ≤ 6rem (~96px)
- Display heading letter-spacing floor: ≥ -0.04em
- Use `text-wrap: balance` on h1-h3 for even line lengths
- Use `text-wrap: pretty` on long prose to reduce orphans
- Product UI: one family is often right. Fixed rem scale, not fluid. Tighter
  scale ratio (1.125-1.2 between steps)

## Layout

- Vary spacing for rhythm. Cards are the lazy answer — use them only when
  they're truly the best affordance. Nested cards are always wrong.
- Flexbox for 1D, Grid for 2D. Don't default to Grid when `flex-wrap` would
  be simpler.
- For responsive grids without breakpoints: `repeat(auto-fit, minmax(280px,
  1fr))`
- Build a semantic z-index scale (dropdown → sticky → modal-backdrop → modal
  → toast → tooltip). Never arbitrary values like 999 or 9999.

## Motion

- 150-250ms on most transitions for product UI. Users are in flow; don't make
  them wait for choreography
- Ease out with exponential curves (ease-out-quart / quint / expo). No bounce,
  no elastic
- Motion conveys state, not decoration. State change, feedback, loading,
  reveal: nothing else
- No orchestrated page-load sequences for product UI
- Reduced motion is not optional. Every animation needs a
  `@media (prefers-reduced-motion: reduce)` alternative
- Reveal animations must enhance an already-visible default. Don't gate
  content visibility on a class-triggered transition

## Design System Drift (for review/polish)

Classify every deviation from the existing design system:

- **Missing token:** the value should exist in the system but doesn't →
  patch the value
- **One-off implementation:** a shared component already exists but wasn't
  used → swap to the shared component
- **Conceptual misalignment:** the feature's flow, IA, or hierarchy doesn't
  match neighboring features → rework the flow

Fixing the symptom without naming the cause is how drift compounds.
