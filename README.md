# Signature Studio

Signature Studio is a privacy-friendly, static web app for creating professional HTML email signatures. It provides a guided landing experience, live editor, template gallery, and email-safe export workflow without requiring an account or server.

## What it does

- Builds responsive, table-based signatures intended for Gmail, Outlook, Apple Mail, and other common clients.
- Lets people edit contact details, action links, layout, dimensions, colors, and logo URLs in real time.
- Provides desktop and mobile previews, rich clipboard copy, raw HTML copy, and downloadable HTML exports.
- Saves the active draft locally in the browser; drafts can also be exported and re-imported as JSON.
- Includes undo/redo, inline validation, accessible focus states, keyboard controls, and Material Symbols UI icons.
- Escapes entered text and restricts generated links/images to safe `http`, `https`, `mailto`, and `tel` URLs.

## Run locally

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173). The project has no runtime dependencies.

## Test

```bash
npm test
```

The tests cover the reactive editor store, layouts, width modes, theme presets, action/contact controls, undo/redo, and safe output handling.

## Project structure

```
index.html               Public landing page, editor, and template gallery
css/studio.css           Responsive design system and interaction styles
js/studio.js             Editor state, persistence, validation, export actions
js/studio-templates.js   Email-safe signature renderer and theme presets
tests/                   Node test suite
```

## Using a generated signature

1. Choose **Create a signature** and fill in the profile fields.
2. Review the desktop and mobile previews.
3. Select **Copy for Gmail / Outlook**.
4. Paste into your email client’s signature settings and save.

For a portable editable backup, use **Export editable draft**. Your browser-stored draft is private to that browser and can be reset at any time.
