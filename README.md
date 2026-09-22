# Cards Signature

A scalable collection of responsive, designer HTML email signature cards and related assets.

## Repository Structure

```
cards-signature/
├── cards/
│   ├── ezekiel-villadolid/
│   │   ├── email-signature.html       # Responsive HTML email signature card
│   │   ├── Villadolid_Ezekiel.pdf     # Resume / CV download asset
│   │   └── assets/
│   │       └── bg.svg                 # Card background SVG
│   └── ...                            # (Future cards)
├── .gitignore
└── README.md
```

## Cards Directory

| Card Name | Role / Specialty | Card File | Direct Assets |
| :--- | :--- | :--- | :--- |
| **Ezekiel P. Villadolid** | Creative Designer & Developer | [`email-signature.html`](cards/ezekiel-villadolid/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |

### Features of Ezekiel's Signature Card:
- **Responsive Layout**: Fluid table with max-width constraint for seamless rendering across desktop and mobile email clients.
- **Deep-Blue Vortex Background**: High-resolution dark aesthetic.
- **Coral-Red (`#ff5252`) SVGs**: Phone, Email, and Location pin icons embedded via cross-client base64 data URIs.
- **Direct CV Download**: Full-width action button wired directly to `Villadolid_Ezekiel.pdf`.
- **Social Action CTAs**: Polished buttons for GitHub Profile and LinkedIn.

## How to Use Any Card
1. Open the card's HTML file (e.g. `cards/ezekiel-villadolid/email-signature.html`) in any web browser.
2. Highlight and copy the rendered card (`Ctrl + C` / `Cmd + C`).
3. In your email client (Gmail, Outlook, Apple Mail, etc.), navigate to **Settings > Signature** and paste (`Ctrl + V` / `Cmd + V`).
