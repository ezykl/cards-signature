# Guided Flow Wizard & Rich Theme Preview Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Signature Studio with an optional 5-step Guided Wizard, a prominent Hero Shuffle button, and rich mini signature cards for theme previewing.

**Architecture:** Extend `studioStore` with `editorMode` (`'guided'` vs `'advanced'`) and `wizardStep` (`1..5`). Reorganize the sidebar in `index.html` into a dual-mode system where both modes drive the identical live signature preview canvas. Replace dot chips with responsive theme preview cards rendering real background styles and accent pills.

**Tech Stack:** Vanilla JavaScript (ES Modules), Vanilla CSS (Flexbox/Grid, CSS custom properties, WCAG AA contrast), HTML5 semantic markup, Node.js test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-10-20-guided-flow-and-theme-cards-design.md`

## Global Constraints

- Preserve 100% backward compatibility with existing drafts stored in `localStorage`.
- Zero external client dependencies (native HTML/CSS/JS only).
- Keep the live signature table email-client safe (nested tables with inline CSS).
- Strict adherence to Conventional Commits (`feat(scope): ...`, `test(scope): ...`, `style(scope): ...`).
- All 28 existing tests + new tests must pass (`npm test`).

---

### Task 1: Store Extensions for Dual-Mode & Wizard Navigation

**Files:**
- Modify: `js/studio.js:10-50`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `createStudioStore(initialState)`
- Produces:
  - `state.editorMode`: `'guided' | 'advanced'` (default: `'guided'`)
  - `state.wizardStep`: integer `1..5` (default: `1`)
  - `store.setEditorMode(mode)`
  - `store.setWizardStep(step)`
  - `store.nextWizardStep()`
  - `store.prevWizardStep()`

- [ ] **Step 1: Write failing unit test for wizard store extensions**
In `tests/studio-controller.test.js`, append:
```javascript
test('store manages editorMode and wizardStep navigation', () => {
  const store = createStudioStore();
  assert.equal(store.getState().editorMode, 'guided');
  assert.equal(store.getState().wizardStep, 1);

  store.setEditorMode('advanced');
  assert.equal(store.getState().editorMode, 'advanced');

  store.setEditorMode('guided');
  store.nextWizardStep();
  assert.equal(store.getState().wizardStep, 2);

  store.setWizardStep(5);
  assert.equal(store.getState().wizardStep, 5);
  store.nextWizardStep(); // Should clamp at 5
  assert.equal(store.getState().wizardStep, 5);

  store.prevWizardStep();
  assert.equal(store.getState().wizardStep, 4);
  store.setWizardStep(1);
  store.prevWizardStep(); // Should clamp at 1
  assert.equal(store.getState().wizardStep, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL because `editorMode` and wizard step functions do not exist yet.

- [ ] **Step 3: Implement wizard state and actions in `createStudioStore`**
In `js/studio.js`:
Add `editorMode: 'guided'`, `wizardStep: 1` to `DEFAULT_SIGNATURE_STATE` in `js/studio-templates.js` or `createStudioStore`.
Add actions to the returned store object:
```javascript
setEditorMode: mode => commit({ ...state, editorMode: mode === 'advanced' ? 'advanced' : 'guided' }),
setWizardStep: step => commit({ ...state, wizardStep: Math.min(5, Math.max(1, Number(step) || 1)) }),
nextWizardStep: () => commit({ ...state, wizardStep: Math.min(5, (state.wizardStep || 1) + 1) }),
prevWizardStep: () => commit({ ...state, wizardStep: Math.max(1, (state.wizardStep || 1) - 1) }),
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test`
Expected: PASS (29 tests passing).

- [ ] **Step 5: Commit**
```bash
git add js/studio.js js/studio-templates.js tests/studio-controller.test.js
git commit -m "feat(store): add editorMode and wizardStep navigation to studioStore"
```

---

### Task 2: Rich Theme Preview Cards & Hero Shuffle Generator

**Files:**
- Modify: `js/studio.js:175-225`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `THEME_PRESETS`, `getBackgroundStyle`, `getContrastRatio`
- Produces: `renderThemeCards(state)` returning HTML string for 16 interactive preview cards.

- [ ] **Step 1: Write failing unit test for `renderThemeCards`**
In `tests/studio-controller.test.js`, append:
```javascript
import { renderThemeCards } from '../js/studio.js';

test('renderThemeCards generates rich preview cards with backgrounds and active state', () => {
  const state = { ...DEFAULT_SIGNATURE_STATE, themePreset: 'cosmic-blue' };
  const html = renderThemeCards(state);

  assert.ok(html.includes('theme-preview-card'));
  assert.ok(html.includes('Cosmic Blue'));
  assert.ok(html.includes('data-preset="cosmic-blue"'));
  assert.ok(html.includes('active')); // cosmic-blue should be active
  assert.ok(html.includes('data-preset="developer-cyan"'));
  assert.ok(html.includes('theme-card-badge'));
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL (`renderThemeCards` is not defined or exported).

- [ ] **Step 3: Implement `renderThemeCards(state)`**
In `js/studio.js`:
```javascript
export function renderThemeCards(state) {
  return Object.entries(THEME_PRESETS).map(([key, preset]) => {
    const isActive = state.themePreset === key;
    const bgStyle = getBackgroundStyle(preset);
    const accent = preset.accentColor;
    const primary = preset.textColorPrimary;
    const secondary = preset.textColorSecondary || preset.textColorMuted || '#94a3b8';
    return `<button type="button" class="theme-preview-card ${isActive ? 'active' : ''}" data-preset="${escapeHTML(key)}" style="${bgStyle}; color:${escapeHTML(primary)};" aria-label="${escapeHTML(preset.name)} theme" aria-pressed="${isActive}">
      <div class="theme-card-top">
        <span class="theme-card-name">${escapeHTML(preset.name)}</span>
        <span class="theme-card-badge" style="background:${escapeHTML(accent)}; color:${preset.bgColor};">Accent</span>
      </div>
      <div class="theme-card-body">
        <span class="theme-card-role" style="color:${escapeHTML(secondary)};">Sample Preview</span>
        <span class="theme-card-swatches">
          <span class="theme-card-dot" style="background:${escapeHTML(preset.bgColor)}"></span>
          <span class="theme-card-dot" style="background:${escapeHTML(preset.bgGradientEnd || preset.bgColor)}"></span>
          <span class="theme-card-dot" style="background:${escapeHTML(accent)}"></span>
        </span>
      </div>
    </button>`;
  }).join('');
}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test`
Expected: PASS (30 tests passing).

- [ ] **Step 5: Commit**
```bash
git add js/studio.js tests/studio-controller.test.js
git commit -m "feat(themes): implement rich theme preview cards generator"
```

---

### Task 3: Dual-Mode Switcher and 5-Step Guided Wizard Markup in `index.html`

**Files:**
- Modify: `index.html:55-65`

**Interfaces:**
- Consumes: Existing form control IDs (`ctrl-full-name`, `ctrl-job-title`, etc.)
- Produces:
  - `.studio-mode-toggle` (`#btn-mode-guided`, `#btn-mode-advanced`)
  - `#guided-mode-pane` with 5 step sections (`#wizard-step-1` to `#wizard-step-5`)
  - `#advanced-mode-pane` containing existing full sections
  - Hero Shuffle buttons (`#btn-hero-shuffle`, `#btn-shuffle-theme`)

- [ ] **Step 1: Add mode toggle and guided wizard sections in `index.html`**
1. At top of `.studio-sidebar`:
   Add `.studio-mode-toggle` with `btn-mode-guided` and `btn-mode-advanced`.
2. Wrap guided flow inside `<div id="guided-mode-pane" class="guided-wizard-pane">`:
   - Wizard header: step label (`#wizard-step-title`), step badge (`#wizard-step-badge`), and progress bar (`#wizard-progress-bar`).
   - `#wizard-step-1` (Profile: Name, Title, Logo URL).
   - `#wizard-step-2` (Theme & Palette: `#btn-hero-shuffle`, `.theme-card-grid` container `#wizard-theme-grid`, font stack selector).
   - `#wizard-step-3` (Layout & Typography: 5 layouts selector `#wizard-layout`, role styling, name size).
   - `#wizard-step-4` (Contacts & Links: dynamic contacts list `#wizard-contact-list`, button shape, action buttons list `#wizard-buttons-list`).
   - `#wizard-step-5` (Final Output & Export: celebration banner, quick summary, copy & download buttons, link to switch to All Controls).
   - Wizard footer: `#btn-wizard-prev` (`< Back`) and `#btn-wizard-next` (`Next: Theme →`).
3. Wrap existing full controls inside `<div id="advanced-mode-pane" class="advanced-controls-pane" hidden>` with the hero shuffle button also added to Appearance & Colors.

- [ ] **Step 2: Run test suite to verify no regressions**
Run: `npm test`
Expected: PASS (30 tests passing).

- [ ] **Step 3: Commit**
```bash
git add index.html
git commit -m "feat(html): add dual-mode switcher and 5-step guided wizard layout"
```

---

### Task 4: CSS Styling for Mode Toggle, Wizard Panels & Rich Theme Cards in `css/studio.css`

**Files:**
- Modify: `css/studio.css:25-45`

**Interfaces:**
- Consumes: CSS custom properties (`--navy`, `--blue`, `--soft`, `--line`, `--shadow`, etc.)
- Produces:
  - `.studio-mode-toggle`, `.mode-tab`
  - `.guided-wizard-pane`, `.wizard-step-header`, `.wizard-progress-bar`, `.wizard-step-panel`, `.wizard-footer`
  - `.theme-card-grid`, `.theme-preview-card`, `.theme-card-top`, `.theme-card-name`, `.theme-card-badge`
  - `.button-shuffle-hero`

- [ ] **Step 1: Implement CSS rules in `css/studio.css`**
1. `.studio-mode-toggle`: Segmented control pill background with smooth tab sliding and active background.
2. `.button-shuffle-hero`: Prominent hero button with gradient/accent background, 48px touch height, bold font, and subtle hover lift.
3. `.theme-card-grid`: 2-column responsive grid (`grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`) with 10px gap.
4. `.theme-preview-card`: 74px min-height, border-radius 10px, padding 10px 12px, border 1px solid rgba(255,255,255,0.15), cursor pointer, smooth scale/shadow on hover.
5. Active card state: `outline: 3px solid var(--blue); outline-offset: 2px; box-shadow: 0 4px 14px rgba(0,0,0,0.2)`.
6. `.wizard-footer`: Sticky or pinned bottom bar with flex row, `< Back` and `Next →` buttons.

- [ ] **Step 2: Run test suite**
Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Commit**
```bash
git add css/studio.css
git commit -m "style(studio): add styles for mode toggle, wizard panels, and rich theme cards"
```

---

### Task 5: Controller Event Wiring & Step Transitions in `js/studio.js`

**Files:**
- Modify: `js/studio.js:180-260, 440-580`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `studioStore`, `renderThemeCards`
- Produces:
  - Working mode switcher (`btn-mode-guided` / `btn-mode-advanced`).
  - Working wizard step transitions (`btn-wizard-prev` / `btn-wizard-next`).
  - Active theme selection by clicking on any rich theme card in both guided and advanced mode.
  - Working hero shuffle button cycling palettes with toast notification.
  - Form validation preventing next step if required fields are missing.

- [ ] **Step 1: Write unit tests for step transitions and card selection handlers**
In `tests/studio-controller.test.js`, append:
```javascript
test('step titles map correctly across 5 wizard steps', () => {
  const steps = [
    { num: 1, title: 'Identity & Profile' },
    { num: 2, title: 'Theme & Palette' },
    { num: 3, title: 'Layout & Typography' },
    { num: 4, title: 'Contacts & Social Links' },
    { num: 5, title: 'Review & Export' }
  ];
  assert.equal(steps.length, 5);
});
```

- [ ] **Step 2: Wire events and DOM updates in `js/studio.js`**
1. In `syncControls(state)`:
   - Render theme preview cards into both `#wizard-theme-grid` (in Step 2) and `.theme-chip-group` (in Advanced mode) using `renderThemeCards(state)`.
   - Update wizard step indicators (`#wizard-step-title`, `#wizard-step-badge`, progress bar width: `(step / 5) * 100%`).
   - Toggle step panels visibility (`#wizard-step-X`).
   - Update footer buttons: disable `#btn-wizard-prev` on step 1; change `#btn-wizard-next` text from "Next: ..." to "Finish & Export" on step 4, and hide on step 5.
   - Toggle `#guided-mode-pane` and `#advanced-mode-pane` according to `state.editorMode`.
2. In `initStudio()`:
   - Bind click on `#btn-mode-guided` and `#btn-mode-advanced` to `studioStore.setEditorMode(...)`.
   - Bind click on `#btn-wizard-prev` to `studioStore.prevWizardStep()`.
   - Bind click on `#btn-wizard-next` to `handleWizardNext()`.
   - Bind click on `#btn-wizard-to-advanced` to switch to advanced mode.
   - Bind click on `#btn-hero-shuffle` and `#btn-shuffle-theme` to `handleShuffle()`.
   - Bind click delegator for `.theme-preview-card` to `studioStore.applyThemePreset(presetKey)`.

- [ ] **Step 3: Run test suite**
Run: `npm test`
Expected: PASS (all tests pass).

- [ ] **Step 4: Commit**
```bash
git add js/studio.js tests/studio-controller.test.js
git commit -m "feat(controller): wire guided wizard navigation, mode switching, and theme cards"
```

---

### Task 6: Visual & Interactive Verification

**Files:**
- Modify: `css/studio.css` (if visual adjustments needed)
- Modify: `js/studio.js` (if bug fixes needed)
- Test: `tests/studio-controller.test.js`

- [ ] **Step 1: Run full automated test suite**
Run: `npm test`
Expected: 100% PASS with 0 failures.

- [ ] **Step 2: Headless browser verification**
Spin up local static server and capture verification screenshots or inspect DOM:
- Verify Step 1 opens cleanly on load.
- Verify clicking Shuffle cycles palettes and live preview updates.
- Verify clicking theme cards selects the card and updates preview.
- Verify clicking Next advances through all 5 steps up to Review & Export.
- Verify switching to "All Controls" shows the full sidebar without losing draft data.

- [ ] **Step 3: Commit and Push**
```bash
git add -A
git commit -m "chore: complete guided flow and theme cards verification"
git push
```
