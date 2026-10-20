# Creative Studio: Block Engine, Template Library, Guardrails

**Date:** 2026-10-20  **Status:** Draft for review  **Path:** Architectural

## 1. Goal

Turn Signature Studio from 3 hardcoded layouts into a creative zone: a large
curated template library plus a block editor that lets anyone remix a template,
while the output stays safe in Gmail and Outlook.

In scope: template engine, template library, block editor, email-safety
guardrails. Out of scope: personal library (save/share), free-form canvas.

## 2. Research findings that constrain the design

Sources: general email-signature design guides and email HTML best-practice articles (2025).

- Nested `<table>` layout only, with `role="presentation"`, `cellpadding/cellspacing/border="0"`,
  and `valign`/`align` attributes (Outlook ignores some CSS alignment).
- Keep width at 600px or less (default 520, hard cap 600; current 720 cap is lowered).
- Inline CSS only, web-safe font stacks only: Arial/Helvetica, Georgia, Courier New.
  Google Fonts fall back to Times New Roman in Outlook.
- Critical info (name, title, phone, email) must be live text, never an image.
- Every `<img>` gets explicit `width`, `height`, `alt` and `display:block`. Export at 2x.
- One primary call to action per signature (warn when more than 1 prominent CTA).
- Gradients, rounded corners, shadows are enhancements only. Always emit a solid fallback.
- Avoid pure black text on dark backgrounds and pure white on light (dark-mode resilience).
- 4 to 6 lines of text maximum is the sweet spot.

## 3. Architecture

```
state = { theme, shell, blocks[] }
renderSignatureHTML(state) -> shell(blocks.map(renderBlock(type, data, theme)))
```

- **Theme tokens:** palette (existing fields), `fontStack` (one of 3 safe stacks), `density`
  (compact | cozy | airy), `radius`, `accentStyle`.
- **Shell:** layout recipe: `stack`, `side-by-side`, `accent-bar`, `banner-top`, `centered`, `split-footer`.
- **Block:** a pure function `(data, theme) -> email-safe table markup`, with a declared `safeIn`
  client list. Block types: `identity`, `avatar`, `logo`, `contacts`, `socials`, `buttons`,
  `divider`, `tagline`, `banner`, `quote`, `legal`.
- **Template:** a JSON document `{ id, name, family, tags, theme, shell, blocks }`.
  Existing 3 layouts and `THEME_PRESETS` are converted to templates first (no regressions).
- **Files:** `js/blocks/*.js` (one per block), `js/shells.js`, `js/templates/*.json`,
  `js/engine.js` (render + validation), `js/studio-templates.js` kept as a thin facade.

## 4. Template library: combination matrix

A template is a combination of **shell x block set x theme family x density**. The library
ships 16 templates. Users pick **preferences** and the gallery ranks templates by match.

### 4.1 Preference axes (filters and ranking)

| Axis | Options |
| :--- | :--- |
| Role / industry | Corporate, Tech/Dev, Creative/Design, Sales/Growth, Founder/Exec, Education/Health |
| Tone | Formal, Friendly, Bold, Minimal, Editorial |
| Density | Compact (3-4 lines), Standard (5-6), Rich (with banner/CTA) |
| Color mood | Dark, Light, Warm, Cool, Mono, Vivid |
| Media | Text only, Logo, Avatar, Banner |

### 4.2 Curated templates (first release)

| # | Name | Family | Shell | Blocks | Theme | Best for |
| :-- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Boardroom | Corporate | accent-bar | identity, contacts, divider, legal | navy + slate, Arial | Corporate, Formal |
| 2 | Counsel | Corporate | side-by-side | logo, identity, contacts, legal | charcoal + gold, Georgia | Legal/Finance |
| 3 | Clinic | Corporate | stack | avatar, identity, contacts, tagline | teal on white, Arial | Education/Health |
| 4 | Terminal | Tech | stack | identity, contacts, socials | dark + cyan, Courier | Tech/Dev |
| 5 | Commit | Tech | side-by-side | avatar, identity, socials, buttons | dark + emerald, Arial | Tech/Dev, Friendly |
| 6 | Studio | Creative | side-by-side | avatar, identity, tagline, socials | white + coral, Georgia | Creative/Design |
| 7 | Gallery | Creative | banner-top | banner, identity, contacts | warm sand + ink, Georgia | Creative, Editorial |
| 8 | Neon Pitch | Creative | centered | logo, identity, buttons | dark + vivid gradient (solid fallback) | Bold |
| 9 | Closer | Sales | banner-top | identity, buttons, banner | blue + orange, Arial | Sales/Growth |
| 10 | Quota | Sales | split-footer | avatar, identity, contacts, buttons | white + red, Arial | Sales, Standard |
| 11 | Founder Note | Exec | stack | identity, quote, contacts | off-white + black, Georgia | Founder/Exec, Minimal |
| 12 | Principal | Exec | accent-bar | identity, contacts | mono, Arial | Exec, Compact |
| 13 | Whisper | Minimal | stack | identity, contacts | white + gray, Arial | Minimal, Compact |
| 14 | Hairline | Minimal | side-by-side | identity, divider, contacts | white + one accent | Minimal, Standard |
| 15 | Magazine | Editorial | split-footer | identity, quote, socials | cream + burgundy, Georgia | Editorial |
| 16 | Aurora | Bold | centered | avatar, identity, tagline, socials | cool dark gradient, Arial | Bold, Rich |

Each family also exposes **3 palette variants** (Dark, Light, Mono), so users get combinations
beyond the 16 base templates without more layout code. "Shuffle" picks a random valid
combination (shell x block set x variant) that passes guardrails.

## 5. Block editor (UI)

- New **Layout** panel: ordered block list with up/down buttons plus drag handle, per-block
  visibility toggle, and a per-block options drawer.
- Add Block menu lists only block types compatible with the current shell.
- Gallery: filter chips for the preference axes, "Best match" sort, and search.
- Undo/redo, autosave and live preview keep working on the new state shape.

## 6. Guardrails

- Renderer emits only features in the block's `safeIn` set.
- **Client check** panel shows warnings: image-only content, contrast below 4.5:1,
  width above 600, more than 1 prominent CTA, more than 6 text lines, missing alt text,
  unsupported font.
- Export validation fails closed: warnings never block copy, but errors (unsafe font,
  non-http image URL) are fixed by the renderer.

## 7. Testing

- Unit tests per block (markup contains required attributes, escapes input).
- Template contract test: every JSON template renders without warnings of severity error.
- Migration test: old saved drafts load into the new state shape.
- Snapshot of each template's HTML to catch accidental email-safety regressions.

## 8. Rollout (sub-project order)

1. Engine and migration of existing 3 layouts (no visual change).
2. Guardrails and client-check panel.
3. Block editor panel.
4. Template library: 16 templates, variants, preference filters, Shuffle.

## 9. Risks

- Rewrite of the renderer: mitigated by migrating existing templates first and keeping tests green.
- Outlook rendering cannot be fully verified locally: mitigated by a manual client checklist per template.
