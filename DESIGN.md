# Design Direction: Signature Studio

**Document:** `DESIGN.md`  
**Purpose:** Establishes visual identity, typography, token architecture, and antislop dials.  
**Reference:** Follows `antislop.md` Craftsmanship Standard (C-1 to C-5) and Part 3 (Liveliness Toolkit).

---

## 1. Product Identity & Purpose

Signature Studio is a private, client-side email signature builder. It generates responsive, cross-client HTML tables compatible with Gmail, Outlook, Apple Mail, and mobile inboxes without requiring an account or server backend.

---

## 2. Antislop Dials (R-37)

| Dial | Level | Setting | Rationale |
|---|---|---|---|
| **ENERGY** | **1** | Calm | Focused utility workspace; calm contrast, zero aggressive glows, no distracting marketing hype. |
| **RHYTHM** | **1** | Uniform | Structured two-column layout (editor controls on left, sticky preview on right); consistent spacing scale. |
| **MOTION** | **1** | Restrained | Hover states and active feedback only; zero continuous loops, pulsing rings, or morphing blobs. |

---

## 3. Keystone Decision Log (R-31: Every Decision Has a Reason)

1. **Why Deep Navy (`#1e3a5f`) and Slate (`#0f172a`) as core colors?**  
   Provides high-contrast, professional structure that reflects established desktop client UI without falling into generic AI purple/neon gradients.
2. **Why Open Sans for body and inputs?**  
   Optimized for readability in compact, information-dense control sidebars and matches recipient email typography.
3. **Why Poppins for headings?**  
   Clean geometric sans with distinct terminal cuts, establishing clear hierarchical contrast against body copy.
4. **Why an 8px uniform border radius?**  
   Maintains geometric consistency across cards, inputs, buttons, and theme chips, avoiding mixed pill/rectangular elements.
5. **Why an authentic email window bar instead of macOS traffic-light dots?**  
   Contextual accuracy: the preview represents an inbox composition window (`New Message`), not an operating system desktop terminal.
6. **Why a single backdrop-filter blur on `.site-header` only?**  
   Maintains header legibility during scroll while adhering to the R-10 dose cap (max 1–2 blurred surfaces).

---

## 4. Color Palette System (R-29)

- **Primary Brand:** Deep Navy (`#1e3a5f`) — authoritative, high contrast.
- **Accent Action:** Blue (`#2563eb`) — functional focus rings, primary action buttons, links.
- **Surface:** `#ffffff` (light), `#1e293b` (dark).
- **Canvas:** `#f8fafc` (light), `#0f172a` (dark).
- **Text Primary:** `#0f172a` (light), `#f8fafc` (dark) — minimum 10:1 contrast ratio.
- **Text Secondary / Muted:** `#475569` (light), `#94a3b8` (dark) — minimum 4.5:1 WCAG AA contrast ratio.
- **Borders & Dividers:** `#cbd5e1` (light), `rgba(255, 255, 255, 0.16)` (dark).

---

## 5. Accessibility & Human Factors (R-25, R-32)

- Every text element satisfies WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text).
- Interactive touch targets maintain a minimum 44px × 44px footprint on mobile viewports.
- All focus rings use a calm, high-contrast `:focus-visible` 3px solid outline with 2px offset.
- Full keyboard navigation: `Tab` follows DOM order, `Enter` / `Space` triggers actions, `Escape` clears active modals/popups.
