# Smart Media Resolver, Avatar Helper & UX Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable users to seamlessly add logos/avatars and CVs from Google Drive, GitHub, Dropbox, Imgur, or zero-upload Initials/GitHub avatars, reorder contacts and CTA buttons, and follow an interactive email client installation guide.

**Architecture:** Add a pure multi-source media URL normalizer (`resolveMediaUrl`) and monogram generator (`buildInitialsAvatarUrl`) in `js/studio-templates.js`. Extend `createStudioStore` in `js/studio.js` with `moveContactField` and `moveButton` reordering actions. Wire quick-avatar generators, local image upload, live URL status feedback, reordering buttons, and an accessible Client Installation Guide modal in `index.html`, `css/studio.css`, and `js/studio.js`.

**Tech Stack:** Vanilla JavaScript (ES Modules), HTML5, CSS3, Canvas API, Node.js Test Runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-10-21-smart-media-and-ux-design.md`

## Global Constraints

- Zero external runtime dependencies; 100% client-side privacy.
- Maintain email-safe nested table markup with inline CSS in `renderSignatureHTML`.
- Preserve 100% backward compatibility with existing drafts in `localStorage`.
- All existing and new automated tests (`npm test`) must pass at every commit checkpoint.
- Follow Conventional Commits (`feat(scope): ...`, `test(scope): ...`, `style(scope): ...`, `docs(scope): ...`).

---

### Task 1: Multi-Source Media URL Resolver & Initials Avatar Generator

**Files:**
- Modify: `js/studio-templates.js`
- Test: `tests/studio-generator.test.js`

**Interfaces:**
- Produces:
  - `resolveMediaUrl(rawUrl, mode = 'image')` -> `{ url, provider, converted, warning, label }`
  - `buildInitialsAvatarUrl(state)` -> `string` (hosted PNG URL from `ui-avatars.com`)
  - Updated `safeUrl(value)` in `js/studio-templates.js` to automatically normalize image/link URLs and allow safe `data:image/...` URLs for local preview/PNG export.

- [x] **Step 1: Write failing unit tests for `resolveMediaUrl` and `buildInitialsAvatarUrl`**
- [x] **Step 2: Run test to verify it fails (`npm test`)**
- [x] **Step 3: Implement `resolveMediaUrl`, `buildInitialsAvatarUrl`, and integrate with `renderSignatureHTML`**
- [x] **Step 4: Run test to verify it passes (`npm test`)**
- [x] **Step 5: Commit (`feat(media): add multi-source raw image url resolver and initials avatar generator`)**

---

### Task 2: Store Reordering Actions for Contacts & CTA Buttons

**Files:**
- Modify: `js/studio.js`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `createStudioStore(initialState)`
- Produces:
  - `store.moveContactField(id, direction)` (`direction`: `'up' | 'down'`)
  - `store.moveButton(id, direction)` (`direction`: `'up' | 'down'`)
  - `extractGithubUsername(state)` -> `string` helper

- [x] **Step 1: Write failing unit tests for `moveContactField`, `moveButton`, and `extractGithubUsername`**
- [x] **Step 2: Run test to verify it fails (`npm test`)**
- [x] **Step 3: Implement reordering methods in `createStudioStore` and `extractGithubUsername` helper**
- [x] **Step 4: Run test to verify it passes (`npm test`)**
- [x] **Step 5: Commit (`feat(store): add contact and action button reordering and github username extractor`)**

---

### Task 3: UI Markup & Styling for Avatar Helpers, Status Pill, Reordering & Install Guide Modal

**Files:**
- Modify: `index.html`
- Modify: `css/studio.css`

**Interfaces:**
- Produces DOM hooks:
  - `#btn-wiz-avatar-initials`, `#btn-wiz-avatar-github`, `#input-wiz-avatar-file`, `#wiz-logo-url-status`
  - `#btn-avatar-initials`, `#btn-avatar-github`, `#input-avatar-file`, `#logo-url-status`
  - `#btn-open-install-guide`, `#btn-wiz-open-install-guide`, `#install-guide-modal`, `#btn-close-install-guide`
  - `.install-tab` buttons and `.install-panel` sections for Gmail, Outlook, and Apple Mail

- [x] **Step 1: Add Avatar Helper Bar, Status Pill, and Install Guide Modal markup to `index.html`**
- [x] **Step 2: Add responsive styles for helper chips, status badges, reorder buttons, and modal in `css/studio.css`**
- [x] **Step 3: Run `npm test` to ensure no regressions**
- [x] **Step 4: Commit (`feat(ui): add avatar helper bar, status pill, and install guide modal markup and styles`)**

---

### Task 4: Wire Controller Logic for Smart Media, Reordering & Install Guide Modal

**Files:**
- Modify: `js/studio.js`
- Test: `tests/studio-controller.test.js`

**Interfaces:**
- Consumes: `resolveMediaUrl`, `buildInitialsAvatarUrl`, `moveContactField`, `moveButton`
- Produces:
  - Auto-conversion & status badge rendering on Logo URL and CTA URL inputs
  - Move Up / Move Down buttons rendered in `renderContactFields` and `renderActionButtons`
  - Quick Avatar buttons (`Initials Badge`, `GitHub Avatar`, `Upload Local File` with Canvas compression)
  - Interactive Client Installation Guide modal controller (tab switching, open/close, Escape key)

- [x] **Step 1: Write failing tests in `tests/studio-controller.test.js` for reorder button rendering and URL normalization wiring**
- [x] **Step 2: Run test to verify it fails (`npm test`)**
- [x] **Step 3: Implement controller logic in `js/studio.js`**
- [x] **Step 4: Run test to verify all tests pass (`npm test`)**
- [x] **Step 5: Commit (`feat(controller): wire smart media resolver, avatar helpers, item reordering, and install modal`)**
