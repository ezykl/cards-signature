# Design Specification: Smart Media Resolver, Instant Avatar Helper & UX Enhancements

## 1. Overview & User Need

Users creating an email signature often store their logo, avatar, or CV/resume on cloud drives (Google Drive, Dropbox) or developer platforms (GitHub), or do not have a hosted logo URL at all. Standard share links from Google Drive (`drive.google.com/file/d/.../view`), GitHub (`github.com/.../blob/...`), or Dropbox (`?dl=0`) render HTML viewer pages rather than raw image bytes, causing broken `<img>` tags in email clients. Meanwhile, uploading personal files to anonymous third-party image hosts compromises user privacy.

This specification introduces a 100% privacy-preserving, zero-cost, client-side solution along with key usability improvements:
1. **Multi-Source URL Detector & Raw Image Resolver (`resolveMediaUrl`)**: Automatically detects and converts shareable links from Google Drive, GitHub, Dropbox, and Imgur into direct, email-safe image or document URLs, while flagging unsupported webpage links (`ibb.co`, `postimg.cc`, `canva.com`, etc.).
2. **Live Image Probe & Provider-Specific Diagnostics**: Verifies image load status in the background and gives tailored guidance if a file's share permissions are restricted.
3. **Instant Zero-Upload Avatar Generator & Local PNG Upload**: Provides 1-click **Initials Monogram Badge** generation (synced with the user's name and theme colors), **GitHub Avatar** auto-fetch, and **Local Image File Upload** (client-side Canvas resize for 2x Retina PNG exports).
4. **Contact & CTA Reordering**: Adds Move Up / Move Down controls for contact rows and action buttons.
5. **Email Client Installation Guide Modal**: Step-by-step interactive instructions for installing signatures in Gmail, Outlook (Desktop & Web), and Apple Mail.

---

## 2. Multi-Source URL Resolver Architecture

### 2.1 `resolveMediaUrl(rawUrl, mode = 'image')`
Exported from `js/studio-templates.js`. Accepts a user-supplied URL string and `mode` (`'image'` or `'link'`), returning:
```javascript
{
  url: string,          // The normalized/converted URL
  provider: string,     // 'google-drive' | 'github' | 'dropbox' | 'imgur' | 'ui-avatars' | 'data-url' | 'direct' | 'webpage-warning' | 'empty' | 'invalid'
  converted: boolean,   // True if the input URL was rewritten into a direct URL
  warning: string|null, // Diagnostic hint if the URL is a non-raw webpage viewer
  label: string         // Human-friendly provider badge label
}
```

### 2.2 Supported Providers & Conversion Rules

1. **Google Drive (`drive.google.com`)**:
   - Extracts `FILE_ID` from `/file/d/{ID}`, `/open?id={ID}`, or `/uc?...id={ID}`.
   - In `image` mode: rewrites to `https://drive.google.com/thumbnail?id={ID}&sz=w512` (bypasses third-party cookie blocks on `uc?export=view`).
   - In `link` mode: normalizes to `https://drive.google.com/file/d/{ID}/view`.
2. **GitHub (`github.com` / `raw.githubusercontent.com`)**:
   - Repo file blob (`github.com/{owner}/{repo}/blob/{branch}/{path}`): rewrites to `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}`.
   - Profile URL (`github.com/{username}` single path segment) in `image` mode: rewrites to `https://github.com/{username}.png?size=256`.
3. **Dropbox (`dropbox.com` / `www.dropbox.com`)**:
   - In `image` mode: replaces `dl=0` or `dl=1` with `raw=1` (or appends `raw=1` while preserving `rlkey` query parameters on modern `/scl/fi/` links).
4. **Imgur (`imgur.com`)**:
   - Single image page (`imgur.com/{id}` where path is not `/a/` or `/gallery/`): rewrites in `image` mode to `https://i.imgur.com/{id}.png`.
   - Album links (`imgur.com/a/...` or `imgur.com/gallery/...`): returns `provider: 'webpage-warning'`.
5. **Non-Direct Webpage Viewers (`ibb.co`, `postimg.cc`, `canva.com`, `1drv.ms`, ` pint.it`, etc.)**:
   - When hostname matches a webpage viewer rather than its CDN (`i.ibb.co`, `i.postimg.cc`), returns `provider: 'webpage-warning'` with a message instructing the user to right-click the image and copy its direct image address.
6. **Data URLs (`data:image/...`)**:
   - Permitted in `isSafeUrl` and `safeUrl` specifically for `data:image/(png|jpeg|jpg|webp|gif|svg\+xml);base64,...` so local image uploads render in the live preview and 2x Retina PNG export, while displaying an advisory badge for HTML email copy.

---

## 3. Instant Avatar Generator & Local Upload

### 3.1 `buildInitialsAvatarUrl(state)`
Exported from `js/studio-templates.js`. Generates a hosted, email-safe PNG monogram URL using `https://ui-avatars.com/api/`:
- `name`: `encodeURIComponent(state.fullName || 'Your Name')`
- `background`: `cleanHex(state.bgColor || '#000440')`
- `color`: `cleanHex(state.accentColor || '#38bdf8')`
- `size=128&bold=true&rounded=true&format=png`

### 3.2 Quick-Action Helper Bar
Added beneath the Logo/Avatar URL input in both Guided Mode (Step 1) and Advanced Mode (Profile section):
- **`Use Initials Badge`**: Calls `buildInitialsAvatarUrl(state)` and sets `logoUrl`.
- **`GitHub Avatar`**: Detects any GitHub username from existing action buttons/contacts or prompts the user, setting `https://github.com/{username}.png?size=256`.
- **`Upload Local Image`**: Opens a hidden `<input type="file" accept="image/*">`, scales the image on an offscreen `<canvas>` (max dimension `240px`), and stores the compressed data URL in `logoUrl`.
- **Live Status Pill (`#logo-url-status` / `#wiz-logo-url-status`)**: Displays conversion feedback, verification status, or provider-specific troubleshooting hints.

---

## 4. Contact & Action Button Reordering

### 4.1 Store Actions
In `createStudioStore` (`js/studio.js`):
- `moveContactField(id, direction)`: Moves contact item `'up'` (`-1`) or `'down'` (`+1`) within `state.contactFields`.
- `moveButton(id, direction)`: Moves button item `'up'` (`-1`) or `'down'` (`+1`) within `state.buttons`.

### 4.2 UI Controls
Each `.dynamic-item-card` header includes compact Move Up (`arrow_upward`) and Move Down (`arrow_downward`) icon buttons (`data-action="move-contact-up"`, `data-action="move-contact-down"`, `data-action="move-btn-up"`, `data-action="move-btn-down"`), disabled at list boundaries.

---

## 5. Email Client Installation Guide Modal

An accessible `<dialog>` or modal overlay (`#install-guide-modal`) triggered from the Export panel (`How to install in Gmail / Outlook`):
- Tabbed instructions for **Gmail (Web)**, **Outlook (Desktop & Web)**, and **Apple Mail (macOS & iOS)**.
- Explains rich-paste workflow, enabling "Always match my default message font" off in Apple Mail, and Google Drive/hosted image best practices.
- Full keyboard accessibility (`Escape` to close, focus management, ARIA roles).
