# Cards Signature Suite & Signature Studio

A modern suite of responsive, designer HTML email signatures and an interactive **Signature Studio** web application allowing real-time customization, live rendering, and one-click rich copying for Gmail, Outlook, Apple Mail, and mobile clients.

---

## ✦ Signature Studio (Interactive Customizer)

Signature Studio transforms email signature creation into an intuitive, real-time builder:

- **Dual-Mode Experience**: Switch seamlessly between the **✦ Studio Customizer** and the **🗂 Template Gallery**.
- **Layout & Dimension Controls**:
  - **Layout Formats**: Landscape Banner (`landscape-v2`), Vertical Portrait (`compact-card`), and Compact Row (`minimal-row`).
  - **Width Sizing Mode**: Choose between **Responsive (Fluid with Max-Width)** and **Fixed Width (Exact px)**.
  - **Corner Radius**: Live slider adjustment from sharp (`0px`) to modern pill (`32px`).
- **Dynamic Contact Fields**: Add, remove, or reorder contact rows (Phone, Email, Location, Website, Calendar, Custom) with hosted PNG icons automatically tinted to your chosen accent color.
- **Modular Action Buttons**: Add up to 4 action pills (GitHub, LinkedIn, CV, Portfolio, Calendar Booking, etc.) with automatic column width balancing (100%, 50/50, 33/33/33, 25/25/25/25) or clean collapse on 0 buttons.
- **Curated Themes & Palettes**: Instant one-click presets (*Developer Cyan*, *Cosmic Blue*, *Slate Tech*, *Royal Indigo*, *Emerald Neon*, *Minimal Light*) plus custom color pickers for background, accent tint, and text colors.
- **Live Preview Canvas**: Real-time sticky rendering with desktop vs. mobile (`380px`) viewport simulation.
- **Exact DOM HTML Copy Pipeline**: Copies the actual live-rendered DOM markup using `ClipboardItem({ "text/html": ..., "text/plain": ... })` with selection fallback.
- **Template Gallery Integration**: Click **✦ Open in Studio** on any pre-made card in the gallery to load its configuration directly into the editor.

---

## 🚀 Getting Started & Testing

### 1. Launch Local Server
The studio uses standard ES Modules. To start the zero-dependency local development server:

```bash
npm start
```
*(or `npm run dev`)*

Open your browser to: **[http://localhost:5173/](http://localhost:5173/)**

### 2. Run Automated Unit Tests
The test suite validates markup generation, table structure, hosted icon URLs, and state controller manipulations using Node's native test runner:

```bash
npm test
```

---

## 📁 Repository Structure

```
cards-signature/
├── index.html                                  # Dual-mode shell (Signature Studio & Gallery)
├── css/
│   └── studio.css                              # Glassmorphic customizer UI & responsive layout
├── js/
│   ├── studio-templates.js                     # Email-safe table markup generator & theme presets
│   └── studio.js                               # Reactive state store, event bindings & clipboard engine
├── tests/
│   ├── studio-generator.test.js                # Unit tests for email table generator & layouts
│   └── studio-controller.test.js               # Unit tests for studio reactive state manager
├── scripts/
│   └── serve.js                                # Zero-dependency local development HTTP server
├── cards/
│   ├── ezekiel-developer-landscape/
│   │   └── email-signature.html                # Developer Landscape V2 (Indigo Vortex & Cyan Icons)
│   ├── ezekiel-landscape/
│   │   └── email-signature.html                # Landscape Studio V1 (Cosmic Navy & Coral Red)
│   ├── ezekiel-villadolid/
│   │   ├── email-signature.html                # Cosmic Blue Vortex signature card
│   │   └── Villadolid_Ezekiel.pdf              # Resume / CV download asset
│   └── ezekiel-professional/
│       └── email-signature.html                # Executive Slate Professional signature card
├── package.json
└── README.md
```

---

## 🗂 Pre-Made Template Gallery

| Card Template | Role / Specialty | Theme & Palette | Card File | Direct Assets |
| :--- | :--- | :--- | :--- | :--- |
| **Developer Landscape V2** | **Software Developer + UI/UX \| Graphic Design** | Indigo Vortex (`#000440` / `#42405E`) + Cyan Icons | [`email-signature.html`](cards/ezekiel-developer-landscape/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |
| **Landscape Studio V1** | **Creative Designer & Developer** | Cosmic Navy + Coral Red (`#ff5252`) Icons | [`email-signature.html`](cards/ezekiel-landscape/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |
| **Cosmic Blue Vortex** | **Creative Designer & Developer** | Cosmic Navy + Stacked Full-Width CTA | [`email-signature.html`](cards/ezekiel-villadolid/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |
| **Executive Professional** | **Creative Designer & Developer** | Corporate Slate + Platinum Icons (`#94a3b8`) | [`email-signature.html`](cards/ezekiel-professional/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |

---

## ✉️ Email Client Compatibility Standards

- **Strict Table Layouts**: Built exclusively with nested `<table>`, `<tr>`, `<td>` structures and inline CSS styles for cross-client support (Gmail, Outlook Windows/Mac, Apple Mail, Thunderbird, iOS Mail, Android Gmail).
- **Hosted CDN PNG Assets**: All icons utilize high-resolution hosted PNG assets from Icons8 and GitHub CDNs with dynamic hex URL tinting (`https://img.icons8.com/material-rounded/48/${hex}/${icon}.png`). No SVG data URIs (`data:image/svg+xml`) that get blocked or stripped by corporate firewalls and webmail clients.
- **Fallback Sizing**: Provides both HTML table dimensions (`width="..."`) and CSS rules (`style="width: ...; max-width: ...;"`) to maintain proper rendering across varying rendering engines.

---

## 📥 How to Install in Gmail or Outlook

1. Open [`index.html`](index.html) (via `npm start`) or choose a template in the Gallery.
2. Customize your details and click **"📋 Copy for Gmail / Outlook"**.
3. In your email client:
   - **Gmail**: Go to **Settings** (`⚙`) &rarr; **See all settings** &rarr; **General** &rarr; scroll to **Signature**.
   - **Outlook**: Go to **Settings** &rarr; **Mail** &rarr; **Compose and reply** &rarr; **Email signature**.
4. Paste (**`Ctrl + V`** / **`Cmd + V`**) directly into the signature box.
5. Save your changes &mdash; your signature is live and ready for outgoing messages.
