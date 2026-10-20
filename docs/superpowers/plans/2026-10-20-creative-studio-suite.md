# Creative Studio Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Signature Studio with email-safe typography controls, button shape/outline customization, 25+ categorized icons, 2 new layouts (`accent-bar` and `split-avatar`), and a client-side 2x Retina PNG export engine.

**Architecture:** Extend `studioStore` and `studio-templates.js` with new typography and button schema fields while maintaining complete backward compatibility. Introduce an in-memory SVG/Canvas rasterizer in `studio.js` for zero-dependency high-DPI image signature downloads. Expand editor panels in `index.html` and `css/studio.css`.

**Tech Stack:** Vanilla JavaScript (ES Modules), HTML5, Canvas API, Inline Email-safe CSS / HTML Tables, Node.js Test Runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-10-20-creative-studio-design.md`

## Global Constraints

- Nested table layout only with strict inline CSS; no external fonts or stylesheet dependencies in signature markup.
- Web-safe font stacks only: Arial/Helvetica, Georgia/Palatino, Courier New, Trebuchet MS/Verdana.
- 100% backward compatibility with existing saved drafts in `localStorage`.
- All automated tests (`npm test`) must pass with 0 failures at every commit checkpoint.
- Commit messages must follow Conventional Commits (`feat(scope): ...`, `test(scope): ...`, `fix(scope): ...`).

---

### Task 1: Extend State Schema & Typography Rendering

**Files:**
- Modify: `js/studio-templates.js:1-50, 440-620`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `DEFAULT_SIGNATURE_STATE`
- Produces:
  - `FONT_STACKS`: `{ sans: string, serif: string, mono: string, grotesk: string }`
  - Extended state fields: `fontFamily: 'sans' | 'serif' | 'mono' | 'grotesk'`, `nameFontSize: number`, `titleStyle: 'regular' | 'uppercase' | 'italic'`
  - Updated `renderSignatureHTML(state)` injecting computed font stack, name size, and title styles.

- [ ] **Step 1: Write failing tests for typography controls**
In `tests/studio-controller.test.js`, append:
```javascript
test('renderSignatureHTML respects typography settings (fontFamily, nameFontSize, titleStyle)', () => {
  const customTypography = {
    ...DEFAULT_SIGNATURE_STATE,
    fontFamily: 'serif',
    nameFontSize: 22,
    titleStyle: 'uppercase'
  };
  const html = renderSignatureHTML(customTypography);
  assert.match(html, /Georgia/);
  assert.match(html, /font-size:\s*22px/);
  assert.match(html, /text-transform:\s*uppercase/);
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL because typography fields are not yet rendered in `renderSignatureHTML`.

- [ ] **Step 3: Implement typography schema and inline styling in `studio-templates.js`**
Define `FONT_STACKS`:
```javascript
export const FONT_STACKS = {
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
  mono: "Consolas, 'Courier New', Courier, monospace",
  grotesk: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', Tahoma, sans-serif"
};
```
Update `DEFAULT_SIGNATURE_STATE` with:
```javascript
  fontFamily: 'sans',
  nameFontSize: 19,
  titleStyle: 'regular',
```
In `renderSignatureHTML`, sanitize `fontFamily`, `nameFontSize` (clamped 14–26), and `titleStyle`. Inject font family into the outer table and compute `nameStyle` and `titleStyle` inline CSS.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test`
Expected: PASS (25/25 tests passing).

- [ ] **Step 5: Commit**
```bash
git add js/studio-templates.js tests/studio-controller.test.js
git commit -m "feat(studio): add typography controls and email-safe font stacks"
```

---

### Task 2: Expand Button Styles (Shapes, Outlines) & 25+ Icon Map

**Files:**
- Modify: `js/studio-templates.js:15-60, 395-440`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `BUTTON_ICON_MAP`, `renderActionButtons(buttons, state)`
- Produces:
  - `BUTTON_SHAPES`: `{ rounded: 8, pill: 999, sharp: 2 }`
  - Expanded `BUTTON_ICON_MAP` with 25+ keys (`x`, `youtube`, `instagram`, `dribbble`, `behance`, `calendly`, `whatsapp`, `telegram`, `discord`, `figma`, `medium`, `substack`, `spotify`, etc.)
  - Support for `btn.style === 'outline'` generating `border: 1px solid ${accent}; background: transparent; color: ${accent}`.

- [ ] **Step 1: Write failing tests for button shapes, outline style, and new icons**
In `tests/studio-controller.test.js`, append:
```javascript
test('renderActionButtons renders button shapes (pill, sharp, rounded) and outline style', () => {
  const state = {
    ...DEFAULT_SIGNATURE_STATE,
    buttonShape: 'pill',
    accentColor: '#38bdf8',
    buttons: [
      { id: 'b1', label: 'Book Call', url: 'https://calendly.com', icon: 'calendly', style: 'outline' }
    ]
  };
  const html = renderSignatureHTML(state);
  assert.match(html, /border-radius:\s*999px/);
  assert.match(html, /border:\s*1px solid #38bdf8/);
  assert.match(html, /calendly\.png/);
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL because `buttonShape`, outline style, and `calendly` icon are not yet recognized.

- [ ] **Step 3: Implement expanded icons, button shapes, and outline style in `studio-templates.js`**
Expand `BUTTON_ICON_MAP` with all 25+ icons.
In `renderActionButtons(buttons, state)`:
Compute button border-radius from `state.buttonShape` (default `8px` if rounded, `999px` if pill, `2px` if sharp).
Support `btn.style === 'outline'`:
```javascript
if (btn.style === 'outline') {
  const accent = safeHex(state.accentColor, '#38bdf8');
  bgStyle = `background-color: transparent; border: 1px solid ${accent}; color: ${accent};`;
}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test`
Expected: PASS (26/26 tests passing).

- [ ] **Step 5: Commit**
```bash
git add js/studio-templates.js tests/studio-controller.test.js
git commit -m "feat(buttons): expand button shapes, outline styles, and 25+ icon map"
```

---

### Task 3: Implement New Layouts (`accent-bar` & `split-avatar`)

**Files:**
- Modify: `js/studio-templates.js:460-630`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `renderContactRows`, `renderActionButtons`, `getBackgroundStyle`, `getTableWidthConfig`
- Produces:
  - `renderAccentBar(state)`
  - `renderSplitAvatar(state)`
  - Layout router in `renderSignatureHTML` routing `accent-bar` and `split-avatar`.

- [ ] **Step 1: Write failing tests for `accent-bar` and `split-avatar` layouts**
In `tests/studio-controller.test.js`, append:
```javascript
test('renderSignatureHTML renders accent-bar and split-avatar layouts', () => {
  const accentBarState = { ...DEFAULT_SIGNATURE_STATE, layout: 'accent-bar' };
  const splitAvatarState = { ...DEFAULT_SIGNATURE_STATE, layout: 'split-avatar' };
  
  const accentHtml = renderSignatureHTML(accentBarState);
  assert.match(accentHtml, /border-left:\s*4px solid/);
  
  const splitHtml = renderSignatureHTML(splitAvatarState);
  assert.match(splitHtml, /width="70"/);
  assert.match(splitHtml, /border-radius:\s*50%/);
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL because `accent-bar` and `split-avatar` layouts are unhandled.

- [ ] **Step 3: Implement `renderAccentBar` and `renderSplitAvatar`**
Add `renderAccentBar(state)`:
- Left cell with `border-left: 4px solid ${state.accentColor}; padding-left: 14px`.
- Crisp vertical hierarchy of Name, Role, Contacts, and Action buttons.
Add `renderSplitAvatar(state)`:
- Two-column responsive table with 70px round avatar (`border-radius: 50%`) on left, details and buttons on right.
Update `renderSignatureHTML` switch statement to handle both layouts.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test`
Expected: PASS (27/27 tests passing).

- [ ] **Step 5: Commit**
```bash
git add js/studio-templates.js tests/studio-controller.test.js
git commit -m "feat(layouts): implement executive accent-bar and split-avatar layouts"
```

---

### Task 4: Client-Side 2x Retina PNG Export Engine

**Files:**
- Create/Modify: `js/studio-export-image.js` (or pure helper in `js/studio.js`)
- Modify: `js/studio.js:245-265`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `#studio-preview-card` innerHTML, target signature dimensions
- Produces: `async function exportSignaturePNG(html, options)` returning Blob / trigger download.

- [ ] **Step 1: Write unit test for SVG foreignObject wrapper construction**
Test that the export serialization wraps HTML in standard SVG `<svg xmlns="http://www.w3.org/2000/svg">` with explicit width/height and UTF-8 charset.

- [ ] **Step 2: Implement image preloader & SVG-to-Canvas rasterizer**
Implement `exportSignaturePNG`:
1. Find all `<img>` tags, fetch with `mode: 'cors'`, convert to base64 data URI (gracefully ignoring failed CORS images so rasterization never aborts).
2. Construct SVG `<foreignObject>` with dimensions.
3. Draw to offscreen `<canvas width="${width * 2}" height="${height * 2}">` with `ctx.scale(2, 2)`.
4. Trigger `<a download="email-signature.png" href="${canvas.toDataURL('image/png')}">` download.

- [ ] **Step 3: Run automated test suite**
Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**
```bash
git add js/studio.js tests/studio-controller.test.js
git commit -m "feat(export): add 2x retina PNG image signature export engine"
```

---

### Task 5: UI Controls & Event Binding in Studio & Index

**Files:**
- Modify: `index.html:45-65`
- Modify: `js/studio.js:180-260, 310-340`
- Modify: `css/studio.css:20-60`

**Interfaces:**
- Consumes: `#ctrl-font-family`, `#ctrl-name-font-size`, `#ctrl-title-style`, `#ctrl-button-shape`, `#btn-studio-download-png`
- Produces: Synced state in `studioStore` on input changes and PNG download action.

- [ ] **Step 1: Add HTML controls in `index.html`**
1. In Appearance section: Font Family select, Name Size slider (`min="16" max="24" value="19"`), Title Style select (`regular`, `uppercase`, `italic`).
2. In Call-to-action section: Button Shape select (`rounded`, `pill`, `sharp`).
3. In Action buttons item editor: Grouped 25+ icon dropdown.
4. In Export panel: `<button id="btn-studio-download-png" class="button button-secondary"><span class="material-symbols-rounded">image</span> Download PNG</button>`.

- [ ] **Step 2: Bind events and sync controls in `js/studio.js`**
Add event listeners to `syncControls(state)` for font family, name font size, title style, button shape, and bind click event for `#btn-studio-download-png`.

- [ ] **Step 3: Style the new controls in `css/studio.css`**
Ensure clean form layouts, 44px touch targets on mobile, and matching design tokens.

- [ ] **Step 4: Run tests**
Run: `npm test`
Expected: PASS (all tests pass).

- [ ] **Step 5: Commit**
```bash
git add index.html js/studio.js css/studio.css
git commit -m "feat(ui): bind typography, button styling, and PNG download controls"
```

---

### Task 6: Update Template Gallery & End-to-End Verification

**Files:**
- Modify: `js/studio.js:240-250` (Gallery template definitions)
- Modify: `css/studio.css` (if needed for gallery card presentation)
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `renderGallery()`, `loadPresetByCardId`
- Produces: 5 diverse templates in gallery showcasing new layouts and button styles.

- [ ] **Step 1: Add curated templates in `renderGallery`**
Expand `cards` array in `renderGallery` to 5 diverse styles:
1. Developer Landscape (`landscape-v2`, tech mono font, pill buttons)
2. Minimal Card (`compact-card`, sans font)
3. Executive Row (`minimal-row`)
4. Boardroom Accent (`accent-bar`, serif font, sharp buttons)
5. Creative Split (`split-avatar`, bold title style, pill buttons)

- [ ] **Step 2: Run test suite & verify 100% pass**
Run: `npm test`
Expected: 100% PASS with 0 failures.

- [ ] **Step 3: Headless browser screenshot verification**
Run headless Edge screenshot of studio editor and gallery view to verify centered, pixel-perfect layout and typography.

- [ ] **Step 4: Commit**
```bash
git add js/studio.js css/studio.css
git commit -m "feat(gallery): add executive accent and creative split templates"
```
