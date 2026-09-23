# Signature Studio - Interactive Email Signature Customizer Design Spec

**Date**: 2026-09-23  
**Status**: Approved  
**Scope**: Interactive Signature Studio Web Application  

---

## 1. Overview & Objective

Transform the static email signature showcase (`index.html`) into an interactive, full-featured web application: **Signature Studio**.

### Problem Solved
Previously, modifying names, colors, dimensions, or structures required manually editing raw HTML template files. Copying signatures also previously relied on hardcoded JavaScript template strings rather than live-rendered markup.

### Core Solution
Signature Studio provides:
1. **Interactive Sidebar Controls**: Modify text, contact info, layout formats, color themes, background styles (solid, gradient, ambient), sizes, and action buttons in real time.
2. **Live Sticky Preview Canvas**: Updates with every keystroke and color change, with simulated desktop/mobile viewports.
3. **Exact DOM HTML Copy Pipeline**: The "Copy for Gmail / Outlook" button dynamically captures the exact rendered DOM markup from the active preview element, ensuring that all customizations (and email-safe hosted PNG icons) are preserved on the clipboard.
4. **Template Gallery Integration**: Allows viewing pre-made baseline designs with an "Open in Studio" button to pre-load any preset into the editor.

---

## 2. Architecture & Data Model

### State Management (`signatureState`)
A single reactive state object controls all visual and text attributes:

```javascript
const signatureState = {
  // Layout & Sizing
  layout: 'landscape-v2', // 'landscape-v2' | 'compact-card' | 'minimal-row'
  maxWidth: 680,          // in px
  borderRadius: 16,       // in px
  
  // Profile Content
  fullName: 'Ezekiel P. Villadolid',
  jobTitle: 'Software Developer + UI/UX | Graphic Design',
  phone: '09939389798',
  email: 'zyk.graphics@gmail.com',
  location: 'M. Logarta Street, San Roque, Cebu City',
  logoUrl: 'https://raw.githubusercontent.com/ezykl/Portfolio/refs/heads/master/public/assets/logo.png',
  
  // Action Buttons
  showGithub: true,
  githubUrl: 'https://github.com/ezykl',
  githubLabel: 'GitHub',
  
  showLinkedin: true,
  linkedinUrl: 'https://www.linkedin.com/in/ezekiel-villadolid',
  linkedinLabel: 'LinkedIn',
  
  showCv: true,
  cvUrl: 'https://raw.githubusercontent.com/ezykl/cards-signature/main/cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf',
  cvLabel: 'Download CV',

  // Visual Theme & Colors
  themePreset: 'developer-cyan',
  bgColor: '#000440',
  bgType: 'solid',               // 'solid' | 'gradient' | 'ambient'
  bgGradientEnd: '#00086b',
  accentColor: '#38bdf8',        // Phone/Email/Location icons & highlights
  textColorPrimary: '#ffffff',
  textColorSecondary: '#93c5fd',
  textColorMuted: '#cbd5e1',
  buttonBg: '#121829',
  buttonBorder: 'rgba(255, 255, 255, 0.16)'
};
```

---

## 3. Component & UI Layout

The application in `index.html` is structured into two main views switched via a top navigation bar:

```
┌────────────────────────────────────────────────────────────────────────┐
│  HEADER: Brand Logo  |  [✦ Studio Customizer]   [🗂 Template Gallery]  │
├───────────────────────────────────┬────────────────────────────────────┤
│  LEFT: Customization Studio       │  RIGHT: Live Preview Canvas        │
│                                   │                                    │
│  [1] Layout & Formats             │  [ 💻 Desktop ] [ 📱 Mobile ]      │
│      • Landscape Banner (Wide)    │                                    │
│      • Compact Card (Vertical)    │  ┌──────────────────────────────┐  │
│      • Minimalist Row             │  │                              │  │
│      • Width & Corner Sliders     │  │   LIVE RENDERING CARD        │  │
│                                   │  │   (#studio-preview-card)     │  │
│  [2] Profile Content              │  │                              │  │
│      • Full Name & Job Title      │  └──────────────────────────────┘  │
│      • Phone, Email, Location     │                                    │
│      • Logo Image URL             │  [ 📋 Copy for Gmail / Outlook ]   │
│                                   │  [ ‹/› Copy HTML ] [ ⬇ Download ] │
│  [3] Themes & Backgrounds         │                                    │
│      • 6 Theme Preset Chips       │                                    │
│      • Background: Solid/Gradient │                                    │
│      • Color Pickers (Accent, BG) │                                    │
│                                   │                                    │
│  [4] Action Buttons & Links       │                                    │
│      • Toggles & Inputs for URLs  │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Preset Themes
1. **Developer Cyan**: Deep Midnight `#000440` + `#38bdf8` Cyan accent.
2. **Cosmic Blue**: Royal Navy `#00054e` + `#ff5252` Coral accent.
3. **Slate Tech**: Modern Carbon `#0b0f19` + `#94a3b8` Slate accent.
4. **Royal Indigo**: Indigo `#1e1b4b` + `#818cf8` Lavender accent.
5. **Emerald Neon**: Dark Forest `#022c22` + `#34d399` Mint/Emerald accent.
6. **Minimal Light**: Clean Light `#f8fafc` + `#2563eb` Royal Blue accent.

---

## 4. Email Client Compatibility & Dynamic Icons

1. **Dynamic CDN Icons with Accent Color**:
   Contact icons are fetched from Icons8 with the selected accent hex color:
   - Phone: `https://img.icons8.com/material-rounded/48/${cleanHex}/phone.png`
   - Email: `https://img.icons8.com/material-rounded/48/${cleanHex}/mail.png`
   - Location: `https://img.icons8.com/material-rounded/48/${cleanHex}/marker.png`
   - White button icons: `https://img.icons8.com/material-rounded/48/ffffff/...`
   - All icons include HTML attributes (`width="13" height="13"`) and inline styles (`width: 13px; height: 13px; display: block; border: 0; outline: none;`) to prevent Outlook from scaling retina images.

2. **Table Layout Standards**:
   - Zero external CSS dependencies in the signature markup.
   - Strict `role="presentation" cellpadding="0" cellspacing="0" border="0"`.
   - Primary `background-color` fallback for clients that do not render CSS gradients.

---

## 5. Copy & Export Pipeline

1. **Rich Clipboard Copy (`copyStudioSignature()`)**:
   - Extracts `const html = document.getElementById("studio-preview-card").innerHTML.trim();`.
   - Creates a `ClipboardItem` containing `{ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([state.fullName], { type: "text/plain" }) }`.
   - Calls `navigator.clipboard.write([item])` with automatic fallback to DOM selection copy.
   - Triggers an animated toast notification.
2. **Raw HTML Copy**: Copies the unescaped HTML string to the clipboard for code editors.
3. **HTML File Download**: Generates a data blob and triggers a browser download for `signature-${state.fullName.toLowerCase().replace(/\s+/g, '-')}.html`.

---

## 6. Verification & Testing

- Test dynamic real-time updates for text fields, color inputs, and layout toggles.
- Verify desktop (100% width up to max-width) and mobile simulation viewports.
- Verify clipboard rich-text copy by pasting into Gmail / Outlook composition window.
- Verify icons load properly through proxy servers once sent.
