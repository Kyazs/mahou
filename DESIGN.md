# Design System — mahou

## Visual Theme

**Black lacquer ofuda.** Warm near-black void, cinnabar seal energy, aged brass as ritual metal. Discipline as magic — sumi-e craft and CLI precision, never neon cyberpunk, never SaaS purple, never anime kitsch.

## Color Palette

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#080706` | Lacquer void |
| `--color-surface` | `#12100e` | Raised panels / ofuda |
| `--color-surface-raised` | `#1a1714` | Nested surfaces |
| `--color-text-primary` | `#f3eee6` | Body / headings |
| `--color-text-secondary` | `#b0a89e` | Supporting copy (≥4.5:1) |
| `--color-text-faint` | `#736c63` | Meta labels |
| `--color-accent-seal` | `#d43b2a` | Cinnabar / hanko / emphasis kanji |
| `--color-accent-brass` | `#c9a06a` | Ritual gold / CTAs / mono commands |
| `--color-accent-ink` | `#8a8378` | Quiet structure |
| `--color-glow` | `#e85a3c` | Soft seal bloom |
| `--color-line` | `rgba(243,238,230,0.08)` | Hairline borders |

**Strategy:** Committed dark. Seal red carries identity; brass carries action. No violet spirit palette.

## Typography

| Role | Family | Notes |
|---|---|---|
| UI / body / display EN | **Bricolage Grotesque** | Characterful grotesque; non-Inter |
| Display JP | **Shippori Mincho** | Ceremonial kanji, ofuda vertical |
| UI JP | **Noto Sans JP** | Labels, seal marks |
| Code | **JetBrains Mono** | Commands, terminal |

Scale: fluid `clamp()` headings; body ~17px / 1.75 line-height on dark.

## Components

- **SiteNav** — fixed; glass on scroll; seal mark + Install CTA + section anchors
- **Hero** — asymmetric ofuda strip + stacked display headline + dual CTA
- **Name** — giant seal kanji + etymology (魔 / 法)
- **Philosophy** — vertical doctrine list with seal nodes (not numbered card grid)
- **How it works** — three ofuda hanging panels (Project / Feature / Lifecycle)
- **Workflow** — ritual ladder + branch panel (pass / fail / replan)
- **Commands** — ledger table with seal dots + layer tags
- **Quick start** — install climax; typed terminal; clone/docs CTAs
- **Footer** — stamp ritual (完) + links

Utilities: `.btn-primary`, `.btn-secondary`, `.section-shell`, `.display-title`, `.lead`, `.ritual-line`, `.ofuda`, `.seal-dot`.

## Layout

- Content max ~72rem; narrative sections often narrower
- Vertical rhythm via `clamp(5.5rem, 13vw, 9rem)` section padding
- Asymmetry preferred over identical card grids
- Section labels: JP + English with seal-dot (not mono uppercase eyebrows on every block)

## Motion

- Ease: `cubic-bezier(0.16, 1, 0.3, 1)`
- Hero mount choreography; per-section scroll reveals (not uniform)
- Footer hanko stamp on enter
- Full `prefers-reduced-motion` support

## Accessibility

WCAG AA: contrast, focus rings on brass, reduced motion, semantic landmarks.
