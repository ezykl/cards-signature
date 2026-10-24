# Industrial Obsidian Website Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct the website from a generic AI/SaaS template into an Industrial Obsidian creative studio with a workspace-first flow where creation happens immediately on page load.

**Architecture:** Split the above-the-fold interface into an active workbench stage (left console controls, right physical inbox simulator). Replace marketing boilerplate and generic step cards with an interactive layout comparator and technical guarantees bar. Maintain 100% backwards compatibility with existing IDs and contracts.

**Tech Stack:** Vanilla JavaScript (ES Modules), CSS with Industrial Obsidian design tokens, zero build/runtime dependencies, Node.js test runner (`node --test`).

**Spec:** [`docs/superpowers/specs/2026-10-24-industrial-obsidian-reconstruction-design.md`](file:///c:/Users/Janre/Documents/antigravity/magical-fermi/docs/superpowers/specs/2026-10-24-industrial-obsidian-reconstruction-design.md)

## Global Constraints
- Preserve all 46 existing unit tests in `tests/*.test.js` without altering test assertions.
- 100% offline client-side privacy: zero external telemetry, zero runtime dependencies.
- No `transition: all`, no layout-forcing animations (compositor-only `transform` and `opacity`).
- Floor against slop: no purple-to-blue gradient blobs, no card-inside-a-card redundancy, instant `:focus-visible`.
- Commit each task with Conventional Commits.

---

### Task 1: Industrial Obsidian Token System & Micro-Grid Atmosphere

**Files:**
- Modify: `css/theme.css`
- Test: `npm test`

- [ ] **Step 1: Replace gradient blob background with engineering micro-dot canvas**
  Update `.landing-bg` and `:root` background styling to use `--canvas-obsidian` (`#0b0d13`) and a precise `radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px) 16px 16px`.
- [ ] **Step 2: Define Industrial Obsidian semantic color tokens**
  Declare `--canvas-obsidian`, `--surface-workbench`, `--surface-panel`, `--surface-active`, `--border-hairline`, `--border-signal`, and `--text-mono` tokens in `:root` and `.dark-mode`.
- [ ] **Step 3: Add tactile hardware keycap styling**
  Add 1px subtle top highlight borders and crisp 6px-8px corners for buttons, chips, and input controls.
- [ ] **Step 4: Run test suite**
  Execute `npm test` to verify zero regression.
- [ ] **Step 5: Commit changes**
  `git commit -m "feat(theme): implement industrial obsidian tokens and micro-grid background"`

---

### Task 2: Workspace-First Split Workbench Layout & Command Bar

**Files:**
- Modify: `index.html`
- Modify: `css/studio.css`
- Test: `npm test`

- [ ] **Step 1: Reconstruct the navigation into the Industrial Command Bar**
  Update `<header class="site-header">` to feature the brand mark, a monospace engine status badge `[ENGINE v1.0 · EMAIL-SAFE]`, inline profile slot chips (`#profile-slots-bar`), and quick action buttons.
- [ ] **Step 2: Reconstruct the Hero into the Live Split Workbench Stage**
  Merge the landing hero and studio into an immediate split workbench:
  - Left column: The Creation Console (`#guided-mode-pane` with quick step selector and inputs).
  - Right column: The Physical Simulator Stage (`#studio-canvas-wrapper` framing `#studio-preview-card` inside Apple Mail/Gmail client chrome).
  - Retain all form IDs (`#wiz-full-name`, `#wiz-job-title`, `#wiz-logo-url`, `#wiz-layout`, etc.).
- [ ] **Step 3: Update workbench styles in `css/studio.css`**
  Style the two-column grid (`minmax(380px, 460px) minmax(0, 1fr)`), clean hardware card borders, and physical window header.
- [ ] **Step 4: Run test suite**
  Execute `npm test` to ensure DOM bindings and 46 tests pass.
- [ ] **Step 5: Commit changes**
  `git commit -m "feat(ui): reconstruct landing page into workspace-first split workbench"`

---

### Task 3: Interactive Layout Comparator & Technical Proof Bar

**Files:**
- Modify: `index.html`
- Modify: `css/studio.css`
- Test: `npm test`

- [ ] **Step 1: Replace generic step cards with Layout Comparator**
  Replace `<div class="steps-grid">` with a dynamic 5-layout comparator strip where users can click to instantly switch between Landscape V2, Compact Card, Minimal Row, Executive Accent, and Split Avatar.
- [ ] **Step 2: Add Engineering Guarantees bar**
  Add high-craft engineering cards: `< 10 KB Payload`, `Zero Tracking / 100% Client-Side`, `Bulletproof Email Client Support`.
- [ ] **Step 3: Style the comparator and guarantees in `css/studio.css`**
  Add high-contrast monospace tags, active state borders (`--border-signal`), and tactile hover lifts.
- [ ] **Step 4: Run test suite**
  Execute `npm test`.
- [ ] **Step 5: Commit changes**
  `git commit -m "feat(ui): add interactive layout comparator and engineering guarantees"`

---

### Task 4: Interactive Wireup & Studio Controller Sync

**Files:**
- Modify: `js/studio.js`
- Test: `npm test`

- [ ] **Step 1: Wire Layout Comparator cards to state**
  Add click listeners to the layout comparator cards that trigger `studioStore.setField('layout', layoutKey)` and update the active comparator card indicator.
- [ ] **Step 2: Sync layout changes with wizard step 3 layout dropdown**
  Ensure selecting a layout in the comparator keeps `#wiz-layout` and `#field-layout` in sync.
- [ ] **Step 3: Run test suite**
  Execute `npm test` to confirm all 46 tests pass.
- [ ] **Step 4: Commit changes**
  `git commit -m "feat(studio): wire layout comparator to store and preview engine"`

---

### Task 5: Hallmark Sweep & Verification

**Files:**
- Modify: `css/theme.css`
- Modify: `css/studio.css`
- Test: `npm test`

- [ ] **Step 1: Run Hallmark sloplint**
  Run `node .agents/skills/hallmark/scripts/sloplint.mjs index.html css/theme.css css/studio.css --scope app` to audit craft gates.
- [ ] **Step 2: Resolve any detected contrast or alignment issues**
  Ensure all text passes 4.5:1 WCAG AA contrast against obsidian surfaces.
- [ ] **Step 3: Run complete automated test suite**
  Execute `npm test` and verify 46/46 tests pass.
- [ ] **Step 4: Push to origin/main**
  Push all commits to `origin/main`.
