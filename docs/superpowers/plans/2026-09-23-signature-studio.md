# Signature Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive Signature Studio web application allowing users to customize email signatures (layout, dimensions, dynamic contact fields, modular buttons, curated color themes, backgrounds) in real time and copy the live-rendered email-compatible HTML directly to the clipboard.

**Architecture:** A clean modular architecture separating the email HTML markup generator (`js/studio-templates.js`), the UI state and event controller (`js/studio.js`), the customizer styles (`css/studio.css`), and the main app container (`index.html`) with dual-mode view (Studio Customizer and Template Gallery).

**Tech Stack:** Vanilla JavaScript (ES6+), Vanilla CSS3, Semantic HTML5 Table layouts for email rendering, Node.js `node:test` test suite.

**Spec:** `docs/superpowers/specs/2026-09-23-signature-studio-design.md`

## Global Constraints

- Zero external CSS or JS library dependencies (no Tailwind, React, or jQuery).
- All generated email signatures must use strictly nested `<table>`, `<tr>`, `<td>` with inline CSS styles for cross-client email compatibility (Gmail, Outlook Windows/Mac, Apple Mail).
- All icons must use hosted PNG assets (Icons8 CDN and GitHub CDN) with dynamic accent color URL tinting; zero SVG data URIs (`data:image/svg+xml`) in the email signature output.
- Every copy action MUST copy the actual live-rendered DOM HTML (`previewEl.innerHTML.trim()`), never hardcoded initial constants.

---

### Task 1: Test Suite & Email Markup Generator (`js/studio-templates.js`)

**Files:**
- Create: `tests/studio-generator.test.js`
- Create: `js/studio-templates.js`

**Interfaces:**
- Produces: `renderSignatureHTML(state: SignatureState): string`
  - Takes a state object and returns an email-safe table HTML string.
- Produces: `DEFAULT_SIGNATURE_STATE: SignatureState`
  - Default template state for initialization.

- [ ] **Step 1: Write the failing tests in `tests/studio-generator.test.js`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSignatureHTML, DEFAULT_SIGNATURE_STATE } from '../js/studio-templates.js';

test('renderSignatureHTML produces valid table markup with default state', () => {
  const html = renderSignatureHTML(DEFAULT_SIGNATURE_STATE);
  assert.ok(html.includes('<table role="presentation"'));
  assert.ok(html.includes('Ezekiel P. Villadolid'));
  assert.ok(html.includes('Software Developer + UI/UX | Graphic Design'));
  assert.ok(html.includes('09939389798'));
  assert.ok(html.includes('zyk.graphics@gmail.com'));
});

test('renderSignatureHTML dynamically embeds accent color into hosted icon URLs', () => {
  const customState = {
    ...DEFAULT_SIGNATURE_STATE,
    accentColor: '#10b981' // emerald
  };
  const html = renderSignatureHTML(customState);
  assert.ok(html.includes('https://img.icons8.com/material-rounded/48/10b981/phone.png'));
  assert.ok(html.includes('https://img.icons8.com/material-rounded/48/10b981/mail.png'));
  assert.ok(!html.includes('data:image/svg+xml')); // Must not contain data URIs
});

test('renderSignatureHTML supports adding custom contact fields', () => {
  const customState = {
    ...DEFAULT_SIGNATURE_STATE,
    contactFields: [
      { id: 'c1', type: 'phone', label: 'Phone', value: '12345678', href: 'tel:12345678' },
      { id: 'c2', type: 'website', label: 'Portfolio', value: 'https://ezykl.dev', href: 'https://ezykl.dev' }
    ]
  };
  const html = renderSignatureHTML(customState);
  assert.ok(html.includes('https://ezykl.dev'));
  assert.ok(html.includes('domain.png'));
});

test('renderSignatureHTML collapses cleanly when 0 buttons are provided', () => {
  const customState = {
    ...DEFAULT_SIGNATURE_STATE,
    buttons: []
  };
  const html = renderSignatureHTML(customState);
  assert.ok(!html.includes('GitHub'));
  assert.ok(!html.includes('Download CV'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/studio-generator.test.js`  
Expected: FAIL (module `../js/studio-templates.js` does not exist).

- [ ] **Step 3: Implement `js/studio-templates.js`**

Implement `renderSignatureHTML(state)` handling:
- Layout format: `landscape-v2`, `compact-card`, `minimal-row`.
- Dynamic contact fields rendering with dynamic accent-tinted Icons8 PNGs.
- Dynamic action buttons with 1 to 4 buttons evenly distributed, or clean collapse on 0.
- Clean inline styles, dimensions, and backgrounds (solid, gradient, ambient).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/studio-generator.test.js`  
Expected: PASS all 4 tests.

- [ ] **Step 5: Commit**

```bash
git add tests/studio-generator.test.js js/studio-templates.js
git commit -m "feat: implement email signature markup generator with unit tests"
```

---

### Task 2: Studio Customizer Stylesheet (`css/studio.css`)

**Files:**
- Create: `css/studio.css`

**Interfaces:**
- Produces: CSS classes for tab switching (`.view-mode-studio`, `.view-mode-gallery`), two-column responsive studio layout (`.studio-container`, `.studio-sidebar`, `.studio-preview-pane`), control groups, collapsible accordion cards, color picker inputs, dynamic field row controls, and action bars.

- [ ] **Step 1: Write `css/studio.css`**

Define styling matching the dark premium theme:
- `.top-nav-tabs`: Segmented pill switch between "✦ Studio Customizer" and "🗂 Template Gallery".
- `.studio-layout`: Grid layout with sticky preview on desktop, single column on tablet/mobile.
- `.control-section`: Card-based accordion sections with clean headers and subtle borders.
- `.form-group`, `.form-label`, `.form-input`: Sleek dark-mode inputs.
- `.theme-chip-group`: Preset chips for Developer Cyan, Cosmic Blue, Slate Tech, Royal Indigo, Emerald Neon, Minimal Light.
- `.dynamic-item-row`: Flex row with icon selector, text input, link input, and remove (✕) button.
- `.btn-add-item`: Dashed border add-button for contact fields and buttons.
- `.viewport-toggle`: Controls for Desktop (100%) vs Mobile (360px) preview simulation.

- [ ] **Step 2: Verify CSS validity and linting**

Run: `powershell -Command "Test-Path css/studio.css"`

- [ ] **Step 3: Commit**

```bash
git add css/studio.css
git commit -m "style: add responsive styles for Signature Studio interface"
```

---

### Task 3: Studio State Controller & Clipboard Logic (`js/studio.js`)

**Files:**
- Create: `js/studio.js`

**Interfaces:**
- Consumes: `renderSignatureHTML`, `DEFAULT_SIGNATURE_STATE` from `js/studio-templates.js`.
- Produces:
  - `initStudio()`: Attaches event listeners to inputs, sets up live bindings.
  - `updatePreview()`: Renders `renderSignatureHTML(state)` into `#studio-preview-card`.
  - `copyStudioSignature()`: Rich clipboard copy reading directly from `#studio-preview-card.innerHTML.trim()`.
  - `copyRawHTML()`: Raw HTML string clipboard copy.
  - `downloadHTML()`: Triggers standalone `.html` download.
  - `addContactField()`, `removeContactField(id)`.
  - `addButton()`, `removeButton(id)`.
  - `applyThemePreset(presetKey)`.
  - `loadTemplateIntoStudio(cardId)`.
  - `switchViewMode(mode)`.

- [ ] **Step 1: Implement `js/studio.js`**

Implement complete controller logic:
- Real-time event delegation for inputs (`input`, `change`).
- Dynamic DOM builder for contact fields list and action buttons list in the sidebar.
- Live preview canvas update on every change.
- Rich-text clipboard copy using `ClipboardItem({ "text/html": htmlBlob, "text/plain": textBlob })`.
- Selection copy fallback with toast alerts.
- Preset loader from existing gallery cards into studio.

- [ ] **Step 2: Add functional tests for state controller**

Add unit tests in `tests/studio-controller.test.js` validating state manipulations: adding fields, removing buttons, applying theme presets, and generating export payload.
Run: `node --test tests/studio-controller.test.js`  
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add js/studio.js tests/studio-controller.test.js
git commit -m "feat: implement Studio state controller and clipboard copy pipeline"
```

---

### Task 4: Integrate Studio UI into Main Application (`index.html`)

**Files:**
- Modify: `index.html`

**Interfaces:**
- Links: `css/studio.css`, `js/studio-templates.js`, `js/studio.js`.
- Renders:
  - Header with mode switcher ("✦ Studio Customizer" | "🗂 Template Gallery").
  - `#studio-view`: The sidebar controls + sticky live preview card.
  - `#gallery-view`: The existing showcase gallery, augmented with "Open in Studio" action buttons on each card.

- [ ] **Step 1: Link CSS and scripts in `index.html`**

Add `<link rel="stylesheet" href="css/studio.css">` and `<script type="module" src="js/studio.js"></script>`.

- [ ] **Step 2: Add Top Nav Tabs & Studio View Markup**

Insert the Studio UI container before the showcase gallery grid, with collapsible sections for Layout, Profile, Dynamic Contacts, Theme & Colors, and Modular Buttons.

- [ ] **Step 3: Add "Open in Studio" buttons to existing cards in gallery**

Add a secondary button to cards 1, 2, 3, 4: `<button class="btn-action-sub" onclick="loadTemplateIntoStudio(N)">Open in Studio</button>`.

- [ ] **Step 4: Verify in Browser & Test Live Interactions**

Start a local server or open `index.html`, verify that:
1. Studio loads by default with live card preview.
2. Changing text, colors, and layout immediately updates the preview card.
3. Adding a new contact field (e.g. Website) adds the row and updates the card.
4. Removing a button removes it from the card.
5. Clicking "Copy Signature" copies the exact modified card HTML with hosted PNG icons.
6. Switching to "Template Gallery" displays the classic showcase; clicking "Open in Studio" loads that card into the editor.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: integrate interactive Signature Studio into index.html"
```

---

### Task 5: End-to-End Verification & Polish

**Files:**
- Verify: `index.html`
- Verify: `js/studio.js`
- Verify: `js/studio-templates.js`
- Verify: `css/studio.css`
- Create: `walkthrough.md`

- [ ] **Step 1: Run all automated tests**

Run: `node --test tests/*.test.js`  
Expected: All tests PASS.

- [ ] **Step 2: Browser testing & verification**

Verify clipboard copy in browser, test pasting into an email client editor, and confirm all hosted PNG URLs load without errors.

- [ ] **Step 3: Document changes in `walkthrough.md`**

Provide visual walkthrough of the new Studio builder and verify all user requirements are fulfilled.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: complete Signature Studio integration and verification"
```
