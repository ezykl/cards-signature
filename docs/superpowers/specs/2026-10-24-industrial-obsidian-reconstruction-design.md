# Design Specification: Industrial Obsidian Website Reconstruction

## Context & Purpose
The current Cards Signature Studio application functions well technically (46 passing unit tests, full client-side privacy, rich theme and layout engines), but suffers from the visual tropes of generic AI-generated SaaS templates:
1. A generic marketing hero with centered text, two pill buttons, and an abstract gradient blob in the background.
2. An unnecessary barrier between "marketing pitch" and the actual studio editor tool.
3. Repetitive card-inside-a-card elevation and generic step numbers (01, 02, 03).
4. Generic color palette that converges on safe blues and grays without industrial craft or conviction.

This reconstruction transitions the website into an **Industrial Obsidian / Craft Studio** aesthetic with a **Workspace-First Flow**, drawing directly from the `hallmark`, `ui-ux-pro-max`, and `emilkowalski` skills.

---

## Core Pillars of the Reconstruction

### 1. Workspace-First Architecture (Zero-Friction Creation)
- **Elimination of Marketing-Editor Divide**: When users open the page, they are immediately in the live studio workbench. There is no separate "marketing view" that pushes the actual tool below or behind a click.
- **The Command Header**:
  - Wordmark + SVG logo on the left with a monospace status badge `[ENGINE v1.0 · COMPILED FOR EMAIL CLIENTS]`.
  - Direct profile slot switcher (`Slot 1 / Slot 2 / Slot 3`) embedded directly into the workspace header.
  - Action tray: Quick Setup (`#btn-open-onboarding`), Theme Toggle (`#btn-toggle-dark`), and Repository Link.
- **Above-the-Fold Split Stage**:
  - **Left (Console Drawer)**: Streamlined, tactile controls for identity, avatar/logo loader, typography, theme palette, and modular buttons.
  - **Right (Hardware-Grade Simulator Stage)**: The live email signature preview framed inside a realistic email client simulator (Apple Mail / Gmail / Outlook chrome) set against an engineering micro-dot canvas.
- **Immediate Interactivity**: Edits made in the console immediately reflect in the preview with zero perceptible latency.

### 2. Aesthetic System: Industrial Obsidian
- **Color Palette & Tokens**:
  - `--canvas-obsidian`: `hsl(225, 24%, 6%)` (`#0b0d13`)
  - `--surface-workbench`: `hsl(225, 20%, 9%)` (`#10131b`)
  - `--surface-panel`: `hsl(225, 18%, 12%)` (`#151923`)
  - `--surface-active`: `hsl(225, 16%, 16%)` (`#1c2130`)
  - `--border-hairline`: `rgba(255, 255, 255, 0.08)`
  - `--border-focus`: `hsl(187, 100%, 50%)` (electric cyan)
  - `--text-title`: `hsl(210, 40%, 98%)`
  - `--text-body`: `hsl(215, 20%, 75%)`
  - `--text-mono`: `hsl(187, 85%, 65%)`
- **Surface & Background Craft**:
  - No purple/blue radial gradient blobs. Replaced with an engineering-grade micro-dot grid (`radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px) 16px 16px`) and subtle dark ambient lighting.
  - Hairline borders with single 1px inset highlights on buttons simulating physical hardware keycaps.
- **Typography & Details**:
  - Monospace metadata labels: `font-family: ui-monospace, 'SF Mono', monospace; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase;`.
  - High-density information architecture with tabular numbers for size and dimension readouts.

### 3. Layout Comparator & Engineering Proof
- Underneath the primary workbench stage, replace the generic 3-card steps grid with an interactive **Layout Comparator**:
  - Allows instant previewing of the user's signature data across all 5 architectures:
    1. *Landscape V2* (modern wide desktop)
    2. *Compact Card* (balanced vertical badge)
    3. *Minimal Row* (ultra-clean horizontal string)
    4. *Executive Accent* (solid left color pillar)
    5. *Split Avatar* (round portrait profile)
- Technical Guarantees row:
  - `< 10 KB Email-Safe Table HTML`
  - `Zero External Tracking or Third-Party Scripts`
  - `100% Client-Side Local Storage Privacy`
  - `Gmail, Outlook, Apple Mail Bulletproof Compatibility`

### 4. Preserved Wiring & Contracts
All existing JavaScript interactions, IDs, storage keys, modal traps, and test hooks must remain completely unbroken:
- `tests/studio-controller.test.js` (46 tests must pass continuously).
- Modal IDs: `#onboarding-modal`, `#install-guide-modal`.
- Control IDs: `#wiz-full-name`, `#wiz-job-title`, `#wiz-logo-url`, `#wiz-font-family`, `#wiz-layout`, `#studio-preview-card`, `#btn-hero-shuffle`, `#btn-open-onboarding`, `#profile-slots-bar`, etc.
- Export actions: `#btn-wiz-copy-primary`, `#btn-wiz-download-png`, `#btn-wiz-download-html`, `#btn-wiz-download-vcf`.

---

## File Modification Plan

1. `index.html`:
   - Redesign navigation into the Industrial Obsidian command bar.
   - Restructure main section into the Workspace-First Stage.
   - Integrate Layout Comparator and technical proof row.
2. `css/studio.css`:
   - Update layout grid for the split workspace stage.
   - Refactor controls into hardware-style console modules.
   - Style layout comparator and technical proof cards.
3. `css/theme.css`:
   - Define Industrial Obsidian design tokens (`--canvas-obsidian`, `--surface-*`, `--border-hairline`, etc.).
   - Replace gradient blobs with micro-dot grid.
   - Add tactile keycap press styles and crisp instantaneous focus states.
4. `js/studio.js`:
   - Ensure view mode defaults seamlessly to the workspace studio without jarring redirects.
   - Wire any new layout comparator shortcuts to `studioStore.setField('layout', ...)`.
