# vCard Generator, Inbox Theme Simulator & Multi-Slot Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standards-compliant vCard (`.vcf`) contact card generator and downloader, an interactive Light/Dark Email Client Inbox Simulator in the live preview pane, and 3 persistent Saved Profile Slots (`Primary`, `Work`, `Personal`) in the editor.

**Architecture:**
1. **`js/studio-templates.js`**: Export pure `generateVCardString(state)` function generating a RFC 6350 / vCard 3.0 string from `fullName`, `jobTitle`, `contactFields`, and `buttons`.
2. **`js/studio.js`**:
   - Add `downloadVCard()` action and export `getProfileSlots()` / `switchProfileSlot(slotKey)` helpers backed by `localStorage`.
   - Add Inbox Simulator toggle state (`light` | `dark`) on `#studio-canvas-wrapper` (`inbox-sim-light` / `inbox-sim-dark`).
3. **`index.html` & `css/studio.css`**:
   - Add the **Saved Profile Slots** switcher bar at the top of `.studio-sidebar`.
   - Add the **Inbox Surface Toggle** (`Light Inbox` / `Dark Inbox`) and simulated email header inside `.studio-preview-pane`.
   - Add **Download vCard (.vcf)** buttons in both Guided Wizard Step 5 and Advanced Export Panel.

---

### Task 1: vCard (`.vcf`) Generator (`js/studio-templates.js` & `tests/studio-generator.test.js`)

- [ ] Write failing unit tests in `tests/studio-generator.test.js` for `generateVCardString(state)` covering name splitting, job title, phone, email, location, website, and social URLs.
- [ ] Implement `generateVCardString(state)` in `js/studio-templates.js`.
- [ ] Run `npm test` and commit with `feat(vcard): add vCard 3.0 contact card generator`.

### Task 2: Saved Profile Slots & Inbox Simulator Logic (`js/studio.js` & `tests/studio-controller.test.js`)

- [ ] Write failing unit tests in `tests/studio-controller.test.js` for profile slot switching (`Primary`, `Work`, `Personal`), inbox simulator toggling, and vCard download wiring.
- [ ] Implement profile slots management, inbox simulator toggle, and `downloadVCard()` in `js/studio.js`.
- [ ] Update `index.html` and `css/studio.css` with Profile Slots bar, Inbox Simulator controls, simulated compose header, and Download vCard buttons.
- [ ] Run `npm test` and commit with `feat(studio): add multi-slot profile switcher, inbox simulator, and vcard export`.
