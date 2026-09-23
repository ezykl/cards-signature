# Signature Studio - Interactive Email Signature Customizer Design Spec

**Date**: 2026-09-23  
**Status**: Approved (Updated with Dynamic Fields & Modular Buttons)  
**Scope**: Interactive Signature Studio Web Application  

---

## 1. Overview & Objective

Transform the static email signature showcase (`index.html`) into an interactive, full-featured web application: **Signature Studio**.

### Problem Solved
Previously, modifying names, colors, dimensions, contact rows, or action buttons required manually altering raw HTML template files. Furthermore, copying signatures previously relied on hardcoded template strings rather than live-rendered markup.

### Core Solution
Signature Studio provides:
1. **Dynamic Content & Contact Items**: Add, edit, reorder, or remove contact rows (Phone, Email, Location, Website, Calendly, Portfolio, Social).
2. **Modular Action Buttons**: Add, customize, or remove buttons (GitHub, LinkedIn, CV, Portfolio, Booking, etc.) with custom labels, icons, links, and styles.
3. **Interactive Sidebar Controls**: Real-time adjustments for layout formats, color themes, background styles (solid, gradient, ambient), sizes, and corner radius.
4. **Live Sticky Preview Canvas**: Updates with every keystroke and color change, with simulated desktop/mobile viewports.
5. **Exact DOM HTML Copy Pipeline**: The "Copy for Gmail / Outlook" button dynamically captures the exact rendered DOM markup from the active preview element, ensuring that all customizations (and email-safe hosted PNG icons) are preserved on the clipboard.
6. **Template Gallery Integration**: Allows viewing pre-made baseline designs with an "Open in Studio" button to pre-load any preset into the editor.

---

## 2. Architecture & Data Model

### State Management (`signatureState`)
A single reactive state object controls all visual, content, and modular attributes:

```javascript
const signatureState = {
  // Layout & Sizing
  layout: 'landscape-v2', // 'landscape-v2' | 'compact-card' | 'minimal-row'
  maxWidth: 680,          // in px
  borderRadius: 16,       // in px
  
  // Profile Content
  fullName: 'Ezekiel P. Villadolid',
  jobTitle: 'Software Developer + UI/UX | Graphic Design',
  logoUrl: 'https://raw.githubusercontent.com/ezykl/Portfolio/refs/heads/master/public/assets/logo.png',
  
  // Dynamic Contact Fields (Add / Edit / Remove)
  contactFields: [
    { id: 'c1', type: 'phone', label: 'Phone', value: '09939389798', href: 'tel:09939389798' },
    { id: 'c2', type: 'email', label: 'Email', value: 'zyk.graphics@gmail.com', href: 'mailto:zyk.graphics@gmail.com' },
    { id: 'c3', type: 'location', label: 'Location', value: 'M. Logarta Street, San Roque, Cebu City', href: '' }
  ],
  
  // Dynamic Action Buttons (Add / Edit / Remove 0 to 4 buttons)
  buttons: [
    { id: 'b1', icon: 'github', label: 'GitHub', url: 'https://github.com/ezykl', style: 'dark' },
    { id: 'b2', icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ezekiel-villadolid', style: 'brand' },
    { id: 'b3', icon: 'download', label: 'Download CV', url: 'https://raw.githubusercontent.com/ezykl/cards-signature/main/cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf', style: 'accent' }
  ],

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

## 3. Dynamic Field & Button Management

### 1. Dynamic Contact Fields
- **Field Types Supported**:
  - `phone` (icon: `phone.png`, default prefix `tel:`)
  - `email` (icon: `mail.png`, default prefix `mailto:`)
  - `location` (icon: `marker.png`, unlinked text)
  - `website` (icon: `domain.png` / globe, default prefix `https://`)
  - `calendar` (icon: `calendar.png`, for Calendly / Cal.com meeting links)
  - `custom` (icon: `star.png` / bullet)
- **User Actions**:
  - Change type from dropdown (dynamically changes icon to match the accent color).
  - Edit display value and optional hyperlink.
  - Delete field via **✕** button.
  - Click **"+ Add Contact Field"** to append a new row.

### 2. Dynamic Action Buttons
- **Supported Icons**:
  - `github`, `linkedin`, `download` / resume, `globe` / portfolio, `calendar` / schedule, `twitter`, `none`.
- **Button Styles**:
  - `dark` (dark slate gradient with border)
  - `brand` (LinkedIn corporate blue)
  - `accent` (gradient matching selected accent color)
- **User Actions**:
  - Edit button text label and target URL.
  - Delete individual button via **✕** button.
  - Click **"+ Add Button"** to append a new button (layout dynamically splits widths evenly: 50/50 for 2, 33/33/33 for 3, 25/25/25/25 for 4).
  - If 0 buttons are configured, the button row collapses completely without leaving empty gaps or broken dividers.

---

## 4. Component & UI Layout

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
│  [2] Profile Header               │  │                              │  │
│      • Name, Title, Logo URL      │  └──────────────────────────────┘  │
│                                   │                                    │
│  [3] Contact Fields (Dynamic)     │  [ 📋 Copy for Gmail / Outlook ]   │
│      • [Phone] 09939389798  [✕]   │  [ ‹/› Copy HTML ] [ ⬇ Download ] │
│      • [Email] zyk.g...     [✕]   │                                    │
│      • [Location] Cebu...   [✕]   │                                    │
│      • [+ Add Contact Field]      │                                    │
│                                   │                                    │
│  [4] Themes & Backgrounds         │                                    │
│      • 6 Theme Preset Chips       │                                    │
│      • Solid vs Gradient vs Mesh  │                                    │
│      • Color Pickers (Accent, BG) │                                    │
│                                   │                                    │
│  [5] Action Buttons (Dynamic)     │                                    │
│      • [GitHub] [URL]       [✕]   │                                    │
│      • [LinkedIn] [URL]     [✕]   │                                    │
│      • [+ Add Button]             │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 5. Email Client Compatibility & Dynamic Icons

1. **Dynamic Hosted Icons with Accent Color**:
   Contact icons are fetched from Icons8 with the selected accent hex color embedded in the URL path:
   - `https://img.icons8.com/material-rounded/48/${cleanHex}/${iconName}.png`
   - White button icons: `https://img.icons8.com/material-rounded/48/ffffff/${buttonIcon}.png`
   - All icons include HTML attributes (`width="13" height="13"`) and inline styles (`width: 13px; height: 13px; display: block; border: 0; outline: none;`).

2. **Table Layout Standards**:
   - Zero external CSS dependencies in the signature markup.
   - Strict `role="presentation" cellpadding="0" cellspacing="0" border="0"`.
   - Primary `background-color` fallback for clients that do not render CSS gradients.

---

## 6. Copy & Export Pipeline

1. **Rich Clipboard Copy (`copyStudioSignature()`)**:
   - Extracts `const html = document.getElementById("studio-preview-card").innerHTML.trim();`.
   - Creates a `ClipboardItem` containing `{ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([state.fullName], { type: "text/plain" }) }`.
   - Writes to clipboard via `navigator.clipboard.write([item])` with automatic fallback to DOM selection copy.
   - Shows an animated toast notification.
2. **Raw HTML Copy**: Copies the unescaped HTML string to the clipboard for code editors.
3. **HTML File Download**: Generates a data blob and triggers a browser download for `signature-${state.fullName.toLowerCase().replace(/\s+/g, '-')}.html`.

---

## 7. Verification & Testing

- Test adding and deleting contact fields; verify live canvas updates and zero formatting glitches.
- Test adding, changing styles of, and removing all buttons; verify clean collapse when 0 buttons are present.
- Verify simulated desktop/mobile viewports.
- Verify clipboard rich-text copy by pasting into Gmail / Outlook composition window.
- Verify that recipient email clients display all dynamically tinted icons cleanly.
