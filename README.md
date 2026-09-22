# Cards Signature

A scalable collection of responsive, designer HTML email signature cards and related assets.

## Live Showcase Landing Page
Open [`index.html`](index.html) in your browser to view the interactive gallery, preview each card live, and copy rich HTML signatures to your clipboard with one click.

## Repository Structure

```
cards-signature/
├── index.html                         # Interactive Showcase Gallery & Signature Copier
├── cards/
│   ├── ezekiel-villadolid/
│   │   ├── email-signature.html       # Cosmic Blue Vortex signature card
│   │   ├── Villadolid_Ezekiel.pdf     # Resume / CV download asset
│   │   └── assets/
│   │       └── bg.svg                 # Card background SVG
│   ├── ezekiel-professional/
│   │   └── email-signature.html       # Executive Slate Professional signature card
│   └── ...                            # (Future cards)
├── .gitignore
└── README.md
```

## Cards Directory

| Card Name | Theme | Role / Specialty | Card File | Direct Assets |
| :--- | :--- | :--- | :--- | :--- |
| **Ezekiel P. Villadolid** | Cosmic Blue Vortex | Creative Designer & Developer | [`email-signature.html`](cards/ezekiel-villadolid/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |
| **Ezekiel P. Villadolid** | Executive Professional | Creative Designer & Developer | [`email-signature.html`](cards/ezekiel-professional/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |

### Features of the Signature Cards:
- **Responsive Layout**: Fluid table with max-width constraint (`280px` – `440px`) for seamless rendering across desktop and mobile email clients.
- **Pure Inline HTML**: Zero JavaScript or external stylesheet dependencies; 100% compatible with Gmail, Outlook, Apple Mail, and Thunderbird.
- **Embedded Vector SVGs**: All icons (Phone, Email, Location Pin) and backgrounds are embedded as cross-client base64 data URIs so they never fail to load or get stripped.
- **Integrated Direct CV Download**: Full-width action button wired directly to `Villadolid_Ezekiel.pdf`.
- **Social Action CTAs**: Polished buttons for GitHub Profile and LinkedIn.

## How to Use Any Card
1. Open [`index.html`](index.html) in any web browser and click **"Copy Signature for Email"** on your preferred card vibe (or open the card HTML file directly, select all, and copy).
2. In your email client (Gmail, Outlook, Apple Mail, etc.), navigate to **Settings > Signature**.
3. Paste (`Ctrl + V` / `Cmd + V`) into the signature box and save.
