# Cards Signature

A scalable collection of responsive, designer HTML email signature cards and related assets.

## Live Showcase Landing Page
Open [`index.html`](index.html) in your browser to view the interactive gallery, preview each card live, and copy rich HTML signatures to your clipboard with one click.

## Repository Structure

```
cards-signature/
├── index.html                                  # Interactive Showcase Gallery & Signature Copier
├── cards/
│   ├── ezekiel-developer-landscape/
│   │   └── email-signature.html                # Developer Landscape V2 (Indigo Vortex & Cyan Icons)
│   ├── ezekiel-landscape/
│   │   └── email-signature.html                # Landscape Studio V1 (Cosmic Navy & Coral Red)
│   ├── ezekiel-villadolid/
│   │   ├── email-signature.html                # Cosmic Blue Vortex signature card
│   │   ├── Villadolid_Ezekiel.pdf              # Resume / CV download asset
│   │   └── assets/
│   │       └── bg.svg                          # Card background SVG
│   ├── ezekiel-professional/
│   │   └── email-signature.html                # Executive Slate Professional signature card
│   └── ...                                     # (Future cards)
├── .gitignore
└── README.md
```

## Cards Directory

| Card Name | Role / Specialty | Theme & Palette | Card File | Direct Assets |
| :--- | :--- | :--- | :--- | :--- |
| **Developer Landscape V2** | **Software Developer + UI/UX \| Graphic Design** | Indigo Vortex (`#000440` / `#42405E`) + Electric Cyan Icons | [`email-signature.html`](cards/ezekiel-developer-landscape/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |
| **Landscape Studio V1** | **Creative Designer & Developer** | Cosmic Navy + Coral Red (`#ff5252`) Icons | [`email-signature.html`](cards/ezekiel-landscape/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |
| **Cosmic Blue Vortex** | **Creative Designer & Developer** | Cosmic Navy + Coral Red + Full-Width Stacked Button | [`email-signature.html`](cards/ezekiel-villadolid/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |
| **Executive Professional** | **Creative Designer & Developer** | Architectural Slate + Platinum Icons (`#94a3b8`) | [`email-signature.html`](cards/ezekiel-professional/email-signature.html) | [`Villadolid_Ezekiel.pdf`](cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf) |

### Features of the Signature Cards:
- **Responsive Layouts**: Fluid tables with max-width constraints for seamless rendering across desktop and mobile email clients.
- **Pure Inline HTML**: Zero JavaScript or external stylesheet dependencies; 100% compatible with Gmail, Outlook, Apple Mail, and Thunderbird.
- **Embedded Vector SVGs**: All icons (Phone, Email, Location Pin, Download) and backgrounds are embedded as cross-client base64 data URIs so they never fail to load or get stripped.
- **Integrated Direct CV Download**: Wired directly to `Villadolid_Ezekiel.pdf`.
- **Social Action CTAs**: Polished buttons for GitHub Profile and LinkedIn.

## How to Use Any Card
1. Open [`index.html`](index.html) in any web browser and click **"Copy Signature"** on your preferred card vibe or layout.
2. In your email client (Gmail, Outlook, Apple Mail, etc.), navigate to **Settings > Signature**.
3. Paste (`Ctrl + V` / `Cmd + V`) into the signature box and save.
