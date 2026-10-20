# Design Specification: Guided Flow Wizard & Rich Theme Preview Cards

## 1. Overview & User Need

While Signature Studio provides deep, fine-grained creative controls (typography, 25+ icons, button shapes, 5 email-safe layouts, and 2x Retina PNG export), users who are new or seeking a quick setup can feel overwhelmed by a long sidebar with all controls exposed simultaneously.

Additionally, palette selection previously used small circular dots that did not communicate how a color palette actually feels when applied to a signature canvas.

This design introduces two major enhancements:
1. **Hero Shuffle & Rich Theme Preview Cards**:
   - The Shuffle button is promoted to a core, prominent feature at the top of the theme selector.
   - Theme presets are transformed from simple dot chips into rich mini signature cards showing the actual background style (solid, gradient, mesh, ambient glow, lines, dots), typography, and accent pill.
2. **Dual-Mode Studio with Optional 5-Step Guided Flow**:
   - A clean mode toggle at the top of the Studio sidebar: `[ ✦ Step-by-Step Guide ]` | `[ ⚙ All Controls ]`.
   - In Guided mode, users walk through a 5-step flow (Identity → Theme & Colors → Layout & Typography → Contacts & Social Links → Final Output & Export) while the live preview remains dynamically rendered on the right.
   - At any time, users can seamlessly switch to "All Controls" to fine-tune without losing any progress.

---

## 2. Core User Experience & Flows

### 2.1 Dual-Mode Toggle
Located at the top of the Studio sidebar:
```html
<div class="studio-mode-toggle" role="tablist" aria-label="Editor view mode">
  <button type="button" id="btn-mode-guided" class="mode-tab active" role="tab" aria-selected="true">
    <span class="material-symbols-rounded" aria-hidden="true">auto_fix_high</span>
    Step-by-Step Guide
  </button>
  <button type="button" id="btn-mode-advanced" class="mode-tab" role="tab" aria-selected="false">
    <span class="material-symbols-rounded" aria-hidden="true">tune</span>
    All Controls
  </button>
</div>
```
- **State Sharing**: Both modes read from and write to the same `studioStore`. No data is separated or lost when toggling modes.
- **Persistence**: User's preferred mode (`guided` vs `advanced`) is saved in `localStorage` alongside the draft.

### 2.2 5-Step Guided Flow Architecture
In Guided Mode, the sidebar renders a step header, an active step panel, and a step footer navigation.

#### **Step 1: Identity & Profile**
- Form inputs: Full Name (required), Role or Team, Profile Avatar / Logo URL.
- Live hint explaining where these appear on the signature.

#### **Step 2: Theme & Colors**
- **Hero Shuffle Action**: Full-width prominent button with animated dice/shuffle icon:
  `[ 🎲 Surprise Me (Shuffle Theme) ]`
- **Rich Theme Preview Grid**: 16 curated theme cards displaying real background styles, text colors, and accent highlights.
- **Font Stack Selector**: Modern Sans, Classic Serif, Tech Monospace, Clean Grotesk.

#### **Step 3: Layout & Typography**
- **Layout Selector**: Visual options for all 5 layouts:
  1. Landscape (wide modern profile)
  2. Compact Card (centered minimal footprint)
  3. Minimal Row (high-volume concise row)
  4. Executive Accent-Bar (left accent border)
  5. Split Avatar (70px round avatar split layout)
- **Role Styling**: Regular, Uppercase, Italic.
- **Name Font Size**: Interactive slider (14px to 26px).

#### **Step 4: Contacts & Social CTAs**
- **Contact Details**: Simplified dynamic list for Phone, Email, Location, Website, Calendar.
- **Call-to-Action Buttons**: Add up to 4 action links with Button Shape select (`Soft Rounded`, `Pill`, `Sharp`), Button Style (`Dark`, `Brand`, `Accent`, `Outline`), and 25+ categorized icons.

#### **Step 5: Final Output & Export**
- **Celebration Header**: "Your signature is ready!"
- **Summary Checklist**: Confirms profile details, active layout, and contrast score.
- **Primary Actions**:
  - `[ Copy for Gmail / Outlook ]` (Primary Large)
  - `[ Download PNG (2x Retina) ]`
  - `[ Copy HTML ]`
  - `[ Download HTML ]`
- **Fine-Tune Link**: `<button type="button" class="text-button" id="btn-wizard-to-advanced">Need deeper customization? Open in All Controls →</button>`

#### **Wizard Navigation Controls**
- Header: Step indicator (`Step 2 of 5: Theme & Colors`) + animated progress bar.
- Footer:
  - `< Back` button (disabled on Step 1).
  - `Next: Layout →` button (changes to `Finish & Export` on Step 4).

---

## 3. Rich Theme Preview Cards

### 3.1 Card Structure
Each theme card is an interactive `<button>` that previews the signature palette in miniature:
```html
<button type="button" class="theme-preview-card" data-preset="cosmic-blue" style="...">
  <div class="theme-card-top">
    <span class="theme-card-name">Cosmic Blue</span>
    <span class="theme-card-badge" style="...">Accent</span>
  </div>
  <div class="theme-card-body">
    <span class="theme-card-role">Software Developer</span>
    <span class="theme-card-swatch-bar"></span>
  </div>
</button>
```

### 3.2 Dynamic Styling
Each card computes inline styles from `THEME_PRESETS[key]`:
- `background`: generated using `getBackgroundStyle(preset)` (linear gradient, ambient glow, mesh, dots pattern, or solid color).
- `color`: `preset.textColorPrimary`.
- `theme-card-badge`: `background: preset.accentColor` with high-contrast text.
- `theme-card-role`: `color: preset.textColorSecondary`.
- Active state: marked with `.active` class, elevated box-shadow, and a high-contrast border outline (`outline: 3px solid var(--blue); outline-offset: 2px`).

---

## 4. Technical Architecture

### 4.1 State Management (`js/studio.js`)
Extend `studioStore` to maintain wizard UI state:
- `editorMode`: `'guided' | 'advanced'` (default: `'guided'` on initial load, or restored from draft).
- `wizardStep`: integer `1..5`.
- New store actions:
  - `setEditorMode(mode)`
  - `setWizardStep(step)`
  - `nextWizardStep()`
  - `prevWizardStep()`

### 4.2 DOM Organization (`index.html`)
- Wrap the sidebar contents into:
  - `<div class="studio-mode-toggle">...</div>`
  - `<div id="guided-mode-pane" class="guided-wizard-pane">...</div>`
  - `<div id="advanced-mode-pane" class="advanced-controls-pane" hidden>...</div>`
- The preview pane `<section class="studio-preview-pane">` remains in the right column, always synchronized with `studioStore`.

### 4.3 Accessibility (a11y)
- Step navigation announced via `aria-live="polite"`.
- Mode switch tabs use `role="tab"` and `aria-selected`.
- Theme preview cards are native `<button>` elements with clear `aria-label` including theme name and contrast rating.
- Full keyboard navigability (Tab, Enter, Space) across wizard steps and theme cards.

---

## 5. Verification & Testing

### 5.1 Unit Tests (`tests/studio-controller.test.js`)
- Store handles `editorMode` ('guided' <-> 'advanced').
- Store navigates `wizardStep` within valid bounds (1 to 5).
- `renderThemeCards` generates cards for all 16 presets with correct background and accent styles.
- State updates in guided mode persist across mode toggling.

### 5.2 Browser & Visual Verification
- Verify dual-mode toggle switches sidebar smoothly without page reload or layout shift.
- Verify clicking Shuffle button in Step 2 cycles palettes and updates the live preview instantly.
- Verify all 16 theme preview cards render with rich backgrounds and correct contrast.
- Verify navigating through Steps 1 to 5 leads to the final output screen with functional export buttons.
