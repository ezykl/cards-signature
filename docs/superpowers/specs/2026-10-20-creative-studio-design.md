# Creative Studio Suite: Extended Typography, Button Customization, 25+ Icons, New Layouts & Retina PNG Export

**Date:** 2026-10-20  
**Status:** Approved by User  
**Path:** Architectural  
**Commit Standard:** Conventional Commits (`feat(scope): concise imperative description`)

---

## 1. Goal & Overview

Expand Signature Studio into a versatile, creative zone with complete design customization freedom while preserving bulletproof email client rendering (Outlook, Gmail, Apple Mail, iOS, Android).

### Core Deliverables:
1. **High-Resolution 2x Retina PNG Export:** Client-side vector-to-canvas rendering for direct image signature download (`email-signature.png`).
2. **Typography Customization Suite:** Email-safe font families (`Arial`, `Georgia`, `Courier New`, `Trebuchet MS`), name font size controls (16px–24px), and title styling toggles (Regular, Uppercase Tracked, Italic).
3. **Button Customization Suite:** Button shapes (`Pill 999px`, `Rounded 8px`, `Sharp 2px`), outline & solid styling variants (`default`, `brand`, `accent`, `outline`), and expanded 25+ categorized icons.
4. **Expanded Layouts:** Added `accent-bar` (executive vertical stripe) and `split-avatar` (modern personal bio) layouts.
5. **Template Gallery Expansion:** Showcasing curated configurations for Executive, Creative, Developer, Minimal, and Sales roles.

---

## 2. Technical Architecture & Data Model

### 2.1 State Schema Extensions (`studioStore`)
In `js/studio-templates.js`, extend `DEFAULT_SIGNATURE_STATE`:

```javascript
export const DEFAULT_SIGNATURE_STATE = {
  // Existing fields
  fullName: 'Ezekiel P. Villadolid',
  jobTitle: 'Software Developer + UI/UX | Graphic Design',
  logoUrl: 'https://raw.githubusercontent.com/ezykl/cards-signature/main/cards/ezekiel-villadolid/img/logo-ezekiel.png',
  layout: 'landscape-v2', // 'landscape-v2' | 'compact-card' | 'minimal-row' | 'accent-bar' | 'split-avatar'
  widthMode: 'responsive',
  maxWidth: 580,
  borderRadius: 16,
  themePreset: 'developer-cyan',
  bgColor: '#000440',
  bgGradientEnd: '#00086b',
  bgGradientAngle: 135,
  bgType: 'solid',
  accentColor: '#38bdf8',
  textColorPrimary: '#ffffff',
  textColorSecondary: '#93c5fd',
  textColorMuted: '#60a5fa',
  contactFields: [ ... ],
  buttons: [ ... ],

  // New Typography Fields
  fontFamily: 'sans', // 'sans' (Arial) | 'serif' (Georgia) | 'mono' (Courier New) | 'grotesk' (Trebuchet MS)
  nameFontSize: 19,    // 16 to 24 (px)
  titleStyle: 'regular', // 'regular' | 'uppercase' | 'italic'

  // New Button Styling Fields
  buttonShape: 'rounded' // 'rounded' (8px) | 'pill' (999px) | 'sharp' (2px)
};
```

### 2.2 Expanded 25+ Icon Map (`BUTTON_ICON_MAP`)
Map standard identifiers to hosted high-contrast monochrome PNGs:
- **Dev & Tools:** `github`, `code`, `terminal`, `figma`
- **Social & Media:** `linkedin`, `x`, `youtube`, `instagram`, `dribbble`, `behance`, `medium`, `substack`, `spotify`
- **Direct Messaging & Booking:** `calendly`, `whatsapp`, `telegram`, `discord`, `email`, `phone`, `chat`
- **General Actions:** `globe`, `download`, `document`, `location`, `star`, `link`

### 2.3 Email-Safe Layout Engine
1. **`accent-bar` Layout:**
   - 4px solid accent-colored border on the left table cell.
   - Stacked name, role, contact items, and horizontal action links.
   - Uses web-safe table cells with strict inline CSS.
2. **`split-avatar` Layout:**
   - Two-column responsive table: Left column features a 70x70px circular avatar/logo; right column hosts typography, contacts, and modular action buttons.

---

## 3. High-Resolution PNG Export Pipeline

```
[Signature HTML Table]
        ↓
[Fetch external images & convert to base64 data URIs] (prevents canvas CORS taint)
        ↓
[Embed in SVG <foreignObject> with dimensions & inline XML namespace]
        ↓
[Load SVG into <img> element]
        ↓
[Draw into offscreen <canvas> scaled by 2x for Retina clarity]
        ↓
[canvas.toBlob() → URL.createObjectURL() → <a download="email-signature.png"> click]
```

### Safety & Error Handling:
- If an external user-provided logo URL is blocked by cross-origin policies, the exporter proceeds without the blocked logo image and displays a toast informing the user.
- Visual loading feedback on `#btn-studio-download-png` (`"Generating PNG..."` with disabled state during processing).

---

## 4. UI Controls Specifications

1. **Appearance Section Controls:**
   - Font family select dropdown with 4 safe font stacks.
   - Name font size range slider (16px to 24px) with dynamic live value output.
   - Title style segment buttons (`Regular`, `Uppercase`, `Italic`).
2. **Call-to-Action Section Controls:**
   - Button shape radio/pill toggle (`Rounded`, `Pill`, `Sharp`).
   - Grouped button icon select dropdown with 25+ options.
   - Button variant select (`Solid`, `Brand`, `Accent`, `Outline`).
3. **Export Panel:**
   - New button `#btn-studio-download-png` positioned beside "Copy HTML" and "Download HTML".

---

## 5. Verification & Testing Strategy

1. **Automated Unit Tests (`tests/studio-controller.test.js` & new tests):**
   - Verify `renderSignatureHTML` respects `fontFamily`, `nameFontSize`, and `titleStyle`.
   - Verify `renderSignatureHTML` correctly renders new `accent-bar` and `split-avatar` layouts.
   - Verify all 25+ icon keys resolve properly in `renderActionButtons`.
   - Verify button shape (`pill`, `rounded`, `sharp`) correctly computes `border-radius`.
   - Verify 100% pass rate for all 24 existing tests.
2. **Visual & Browser Verification:**
   - Verify template gallery preview renders all layouts centered with consistent scaling.
   - Test PNG generation with and without remote logo.
   - Test responsive mobile view toggle in studio canvas.

---

## 6. Git Commit Protocol
All commits follow Conventional Commits standard:
- `feat(studio): add typography controls and safe font stacks`
- `feat(buttons): expand button shapes, outline styles, and 25+ icon map`
- `feat(layouts): implement executive accent-bar and split-avatar layouts`
- `feat(export): add 2x retina PNG image signature export engine`
- `test(studio): add test coverage for new layouts, typography, and icon map`
