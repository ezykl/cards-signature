# Spec: Palette Studio & Creative Background Styles

**Date:** 2026-10-19  
**Status:** Approved for Implementation  
**Project:** Signature Studio  

## 1. Overview & Goals
The objective is to elevate Signature Studio into a refined, creative-studio experience with enhanced color and background styling capabilities while preserving strict email-client compatibility (HTML tables, inline styles, solid fallback colors).

### Core Goals:
1. **Palette Studio:** Expand beyond 6 presets to 16 curated aesthetic presets with visual swatch previews and a "Shuffle / Surprise Me" button.
2. **Background Styles:** Support 7 distinct background techniques (`solid`, `gradient`, `ambient`, `mesh`, `dots`, `grid`, `lines`) with an adjustable gradient angle slider (`0deg` to `360deg`).
3. **Contrast Intelligence:** Add an automatic WCAG AA contrast ratio calculator that warns the user in real-time if primary text does not achieve 4.5:1 against the signature background.
4. **Email Safety:** Every advanced background style retains a guaranteed solid `background-color` fallback for clients like desktop Outlook, while modern clients (Gmail, Apple Mail, Outlook Web) render the full aesthetic.

---

## 2. State & Data Model Updates

In `DEFAULT_SIGNATURE_STATE` and `renderSignatureHTML`:
- `bgType`: `'solid' | 'gradient' | 'ambient' | 'mesh' | 'dots' | 'grid' | 'lines'` (default: `'solid'`)
- `bgGradientAngle`: integer degrees `0` to `360` (default: `135`)
- `themePreset`: string key matching one of the 16 presets

### 16 Curated Presets:
1. `developer-cyan` (Deep Navy & Cyan)
2. `cosmic-blue` (Midnight & Azure)
3. `slate-tech` (Graphite & Electric Blue)
4. `royal-indigo` (Deep Purple & Lavender)
5. `emerald-neon` (Forest Night & Mint)
6. `minimal-light` (Clean White & Slate)
7. `sunset-crimson` (Deep Burgundy & Coral)
8. `cyber-amber` (Charcoal & Warm Gold)
9. `rose-gold` (Obsidian & Soft Rose)
10. `nordic-frost` (Arctic Blue & Ice Cyan)
11. `aurora-green` (Deep Sea & Lime Neon)
12. `monochrome-pro` (Pure Obsidian & Silver)
13. `terracotta-warm` (Espresso & Terracotta)
14. `neo-tokyo` (Night Violet & Hot Pink)
15. `sand-dune` (Soft Cream & Warm Bronze)
16. `ocean-abyss` (Abyssal Navy & Aquamarine)

---

## 3. Email Background Styling Strategy
Email client background compatibility:
- `getBackgroundStyle(state)` generates:
  - `background-color: ${bg};` (always present first)
  - `background-image: ...;`
  - `background-size: ...;` (when applicable for pattern overlays)

```javascript
switch (state.bgType) {
  case 'gradient':
    return `background-color: ${bg}; background-image: linear-gradient(${angle}deg, ${bg} 0%, ${end} 100%);`;
  case 'ambient':
    return `background-color: ${bg}; background-image: radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.12) 0%, transparent 60%), linear-gradient(${angle}deg, ${bg} 0%, ${end} 100%);`;
  case 'mesh':
    return `background-color: ${bg}; background-image: radial-gradient(at 0% 0%, ${accent}33 0px, transparent 55%), radial-gradient(at 100% 100%, ${end}88 0px, transparent 55%), linear-gradient(${angle}deg, ${bg} 0%, ${bg} 100%);`;
  case 'dots':
    return `background-color: ${bg}; background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(${angle}deg, ${bg} 0%, ${end} 100%); background-size: 14px 14px, 100% 100%;`;
  case 'grid':
    return `background-color: ${bg}; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(${angle}deg, ${bg} 0%, ${end} 100%); background-size: 20px 20px, 20px 20px, 100% 100%;`;
  case 'lines':
    return `background-color: ${bg}; background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04) 2px, transparent 2px, transparent 12px), linear-gradient(${angle}deg, ${bg} 0%, ${end} 100%);`;
  case 'solid':
  default:
    return `background-color: ${bg};`;
}
```

---

## 4. Contrast Ratio Utility
Calculates relative luminance per WCAG 2.1 specifications:
- `L = 0.2126 * R + 0.7152 * G + 0.0722 * B` (where RGB values are sRGB linear converted)
- `contrastRatio = (L1 + 0.05) / (L2 + 0.05)`
- Displays a pill badge in the UI:
  - If ratio >= 4.5: `Good contrast (X.X:1)` (green)
  - If ratio < 4.5: `Low contrast (X.X:1 - Recommend >= 4.5:1)` (amber warning)

---

## 5. UI & Interaction Enhancements
1. **Theme Preset Swatches:** Swatches render mini gradient dots representing base color, end gradient, and accent badge.
2. **Shuffle Button:** An action button `Shuffle Palette` that randomly selects one of the 16 presets or generates a complementary pairing.
3. **Angle Slider:** Only displayed when `bgType` is not `'solid'`.
4. **Contrast Indicator:** Visible live inside the Appearance section.

---

## 6. Testing & Validation
- Unit tests in `tests/studio-generator.test.js`:
  - Verify all 7 `bgType` values render valid background CSS with fallback `background-color`.
  - Verify `bgGradientAngle` is sanitized and interpolated.
  - Verify all 16 presets are defined and contain required keys.
  - Verify contrast ratio calculation on known sample pairs (#000000 and #ffffff = 21:1).
