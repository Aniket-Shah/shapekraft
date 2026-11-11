# ShapeKraft — Brand Design

Single source of truth for the visual identity. Tokens below mirror [src/app/globals.css](src/app/globals.css); if they diverge, the CSS wins — update this file.

## Principles
- **60 / 30 / 10.** Burnt Sienna dominates, Cream Linen supports, Royal Teal accents.
- **Obsidian Black text** everywhere, in tone-shades, except on teal fills (cream text).
- **Bold display, quiet body.** Syne for headlines, Inter for everything else.
- **Generous space, smooth motion.** 8pt spacing, fluid type, eased animation.
- **Accessible by default.** Visible focus rings, reduced-motion support, AA contrast.

## Color — 60 / 30 / 10

| Role | Share | Family | Base |
|---|---|---|---|
| Dominant: page, hero, nav, footer, contact | 60% | Burnt Sienna | `#E97451` (sienna-500) |
| Secondary: content bands, cards (`.theme-cream`) | 30% | Cream Linen | `#FAF0E6` (cream-200) |
| Accent: buttons, marquee strip (`.theme-teal`), highlights | 10% | Royal Teal | `#0B646C` (teal-600) |
| Text | n/a | Obsidian Black | `#0B0B0F` (obsidian-900) |

### Tone-shade scales (all defined in globals.css)

| Step | Sienna | Cream | Teal | Obsidian |
|---|---|---|---|---|
| 50 | `#FEF4F0` | `#FFFDF9` | `#E6F4F5` | |
| 100 | `#FBE5DC` | `#FDF8F0` | `#C2E3E6` | |
| 200 | `#F7CBBA` | `#FAF0E6` | `#8CC8CD` | |
| 300 | `#F2AB90` | `#F3E4D2` | `#52A8AF` | |
| 400 | `#EE9070` | `#E8D3BA` | `#2A8890` | `#7A7A85` |
| 500 | `#E97451` | `#D6BA9A` | `#0E7C86` | `#55555F` |
| 600 | `#C95E3E` | `#B89A78` | `#0B646C` | `#3B3B44` |
| 700 | `#A54A31` | `#8E7457` | `#084D53` | `#26262D` |
| 800 | `#7C3826` | | `#063A3F` | `#17171C` |
| 900 | `#52251A` | | `#04282B` | `#0B0B0F` |

### Semantic tokens

| Token | Sienna context (default) | `.theme-cream` | `.theme-teal` |
|---|---|---|---|
| `--color-bg` | sienna-500 | cream-200 | teal-600 |
| `--color-surface` | cream-100 | cream-50 | teal-500 |
| `--color-text` | obsidian-900 | obsidian-900 | cream-50 |
| `--color-muted` | obsidian-700 | obsidian-500 | cream-200 |
| `--color-border` | sienna-700 | cream-400 | teal-400 |
| `--color-primary` (fills) | teal-600 | teal-600 | teal-600 |
| `--color-primary-fg` | cream-50 | cream-50 | cream-50 |
| `--color-primary-ink` (teal text) | teal-900 | teal-600 | cream-50 |
| `--color-accent` (hover, focus, big highlights) | teal-700 | teal-700 | teal-700 |

Guidelines
- Section order of colour: sienna → cream → sienna; keep roughly 60/30/10 by area.
- Use `--color-primary-ink` for teal-coloured **text**; use `--color-accent` only for large display text.
- `--color-muted` on sienna is obsidian-700 (about 5:1 contrast). Don't go lighter.
- Don't introduce new hues without adding a token.

### Brand assets using the palette
- Favicon ([icon.svg](src/app/icon.svg)): obsidian mark on sienna.
- Social share image ([opengraph-image.tsx](src/app/opengraph-image.tsx)): sienna background, obsidian text, teal pill, cream glow.
- Browser theme color: `#E97451`.
- Quote PDF/print estimate (in `QuotationBuilder.tsx`): cream page, obsidian text, teal labels, sienna accent bar.
- Hardcoded hex is only allowed in those non-CSS contexts (image, SVG, print HTML); everywhere else use tokens.

## Typography

| Role | Font | Variable | Notes |
|---|---|---|---|
| Display / headings | **Syne** | `--font-display` (`.font-display`) | Tight, bold, large |
| Body / UI | **Inter** | `--font-sans` | Default on `body`, line-height 1.6 |
| Accent (special use) | **Black Ops One** | `--font-black-ops-one` | Loaded in layout; use only for deliberate stylistic moments |

Fluid scale (`clamp`-based)

| Token | Range |
|---|---|
| `--fs-xs` | 0.75 → 0.875rem |
| `--fs-sm` | 0.875 → 1rem |
| `--fs-base` | 1 → 1.125rem |
| `--fs-lg` | 1.25 → 1.5rem |
| `--fs-xl` | 1.5 → 2rem |
| `--fs-2xl` | 2 → 3rem |
| `--fs-3xl` | 3 → 5rem |
| `--fs-hero` | 3 → 8rem |

## Spacing (8pt grid)
`--s-1` 0.5rem · `--s-2` 1rem · `--s-3` 1.5rem · `--s-4` 2rem · `--s-6` 3rem · `--s-8` 4rem · `--s-12` 6rem · `--s-16` 8rem · `--s-24` 12rem

## Layout
- Max content width: `--max-w` 1440px
- Side gutter: `--gutter` = `clamp(1rem, 4vw, 2rem)`

## Shape
| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 0.5rem | Inputs, small chips |
| `--radius-md` | 1rem | Cards, buttons |
| `--radius-lg` | 2rem | Large panels, media |
| `--radius-full` | 9999px | Pills, avatars |

## Motion
| Token | Value |
|---|---|
| `--d-fast` / `--d-base` / `--d-slow` / `--d-slower` | 200 / 400 / 800 / 1200 ms |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` — default for entrances |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` — transitions between states |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` — playful accents only |

Rules
- Always honor `prefers-reduced-motion` (already enforced globally).
- Use `overflow-x: clip` on `html` (not `hidden`) to keep Lenis smooth-scroll calculations correct.

## Z-index scale
`--z-base` 0 · `--z-above` 10 · `--z-nav` 100 · `--z-modal` 200 · `--z-cursor` 999 · `--z-toast` 9999

## Accessibility
- Focus: 2px `--color-accent` outline, 3px offset, on `:focus-visible` only.
- Skip-to-content link present in the root layout.
- Text selection uses teal (primary) background with cream-50 text.
- Text on sienna is obsidian-900 / obsidian-700 (about 5:1 or better); text on teal fills is cream-50.
- Minimum touch target 44×44px.

## Do / Don't
- ✅ Sienna base, cream bands, teal accents, obsidian text, large Syne headlines.
- ✅ Use tokens (`bg-surface`, `text-muted`, `border-border`) rather than raw hex.
- ❌ Don't use pure white or pure black, or any hue outside the four families.
- ❌ Don't use Black Ops One for body or UI text.
- ❌ Don't hardcode spacing, durations, or z-index values.
