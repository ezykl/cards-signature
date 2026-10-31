/**
 * Signature Studio - Design Families
 *
 * Art-directed designs that each render in three formats (landscape, portrait, compact).
 * Everything here emits email-safe table markup (inline CSS, bgcolor fallbacks, no SVG,
 * no clip-path). Decorative shapes degrade gracefully: rounded corners become square in
 * Outlook, but layout and colour-blocking survive.
 *
 * NOTE: circular import with studio-templates.js is intentional; shared helpers are only
 * used inside functions, never at module-evaluation time.
 */
import {
  DEFAULT_SIGNATURE_STATE,
  escapeHTML,
  safeUrl,
  getLogoRenderConfig,
  getFontFamily,
  getTitleStyleAttr,
  getBackgroundStyle,
  getBorderColor,
  getContrastRatio,
  getTableWidthConfig,
  renderContactRows,
  renderActionButtons,
  renderSignatureHTML
} from './studio-templates.js';

export const DESIGN_FORMATS = [
  { id: 'landscape', label: 'Landscape' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'compact', label: 'Compact' }
];

export const DESIGN_FAMILIES = [
  { id: 'classic', label: 'Classic', blurb: 'Original layouts' },
  { id: 'lime-panel', label: 'Color Column', blurb: 'Accent column with framed photo' },
  { id: 'ocean-split', label: 'Ocean Split', blurb: 'Light photo panel, bold body' },
  { id: 'midnight-corner', label: 'Midnight Corner', blurb: 'Dark body, accent corner' },
  { id: 'teal-ring', label: 'Teal Ring', blurb: 'Clean card, thick photo ring' }
];

const FORMAT_WIDTH = { landscape: 640, portrait: 320, compact: 440 };
const PORTRAIT_MAX_WIDTH = 420;
const PHOTO_BASE = { landscape: 104, portrait: 96, compact: 52 };

function isLight(hex) {
  return getContrastRatio(hex, '#0f172a') > getContrastRatio(hex, '#ffffff');
}

/** Readable text tones for a given panel background. */
function tonesFor(bg) {
  const light = isLight(bg);
  return {
    light,
    primary: light ? '#0f172a' : '#ffffff',
    secondary: light ? '#334155' : '#e2e8f0'
  };
}

function initialsOf(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/**
 * Per-family art direction. Everything is derived from the active theme tokens.
 */
function familyConfig(id, state) {
  const accent = state.accentColor;
  const themed = getBackgroundStyle(state);
  const themedBg = state.bgColor;
  switch (id) {
    case 'lime-panel':
      return {
        sideStyle: `background-color: ${accent};`, sideBg: accent,
        bodyStyle: themed, bodyBg: themedBg,
        photo: { shape: 'circle', ring: 4, ringColor: '#ffffff', pad: 0 },
        topBar: null, corner: null, sideEdge: null
      };
    case 'ocean-split':
      return {
        sideStyle: 'background-color: #f1f5f9;', sideBg: '#f1f5f9',
        bodyStyle: themed, bodyBg: themedBg,
        photo: { shape: 'circle', ring: 4, ringColor: accent, pad: 0 },
        topBar: null, corner: null, sideEdge: accent
      };
    case 'midnight-corner':
      return {
        sideStyle: themed, sideBg: themedBg,
        bodyStyle: themed, bodyBg: themedBg,
        photo: { shape: 'rounded', ring: 3, ringColor: accent, pad: 0 },
        topBar: accent, corner: accent, sideEdge: null
      };
    case 'teal-ring': {
      const surface = isLight(themedBg) ? themedBg : '#ffffff';
      return {
        sideStyle: `background-color: ${surface};`, sideBg: surface,
        bodyStyle: `background-color: ${surface};`, bodyBg: surface,
        photo: { shape: 'circle', ring: 5, ringColor: accent, pad: 3, padBg: '#ffffff' },
        topBar: accent, corner: null, sideEdge: null
      };
    }
    default:
      return null;
  }
}

function renderPhoto(state, photoCfg, format) {
  const base = PHOTO_BASE[format];
  const scale = (Number(state.logoSize) || 70) / 70;
  const size = Math.max(32, Math.min(140, Math.round(base * scale)));
  // Designs are photo-first: always crop to a square avatar.
  const logo = getLogoRenderConfig({ ...state, logoSize: size, logoFit: 'cover' }, size, photoCfg.shape, 'center');
  const border = state.logoBorder && state.logoBorder !== 'none'
    ? logo.border
    : `${photoCfg.ring}px solid ${photoCfg.ringColor}`;
  const pad = photoCfg.pad ? `padding: ${photoCfg.pad}px; background-color: ${photoCfg.padBg || '#ffffff'};` : '';
  const url = safeUrl(state.logoUrl);

  if (url) {
    return {
      size,
      html: `<img src="${url}" alt="Logo" width="${size}" height="${size}" style="display: block; margin: 0 auto; border: ${border}; ${pad} outline: none; border-radius: ${logo.borderRadius}; width: ${size}px; height: ${size}px; object-fit: cover;" />`
    };
  }

  const onAccent = tonesFor(state.accentColor).primary;
  return {
    size,
    html: `<div style="width: ${size}px; height: ${size}px; line-height: ${size}px; margin: 0 auto; text-align: center; font-weight: 700; font-size: ${Math.round(size * 0.38)}px; color: ${onAccent}; background-color: ${state.accentColor}; border: ${border}; border-radius: ${logo.borderRadius};">${escapeHTML(initialsOf(state.fullName))}</div>`
  };
}

function ruleBlock(accent, align) {
  const alignAttr = align === 'center' ? ' align="center"' : '';
  return `<table role="presentation"${alignAttr} cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0;"><tr><td width="36" height="2" bgcolor="${accent}" style="width: 36px; height: 2px; line-height: 2px; font-size: 0; background-color: ${accent};">&nbsp;</td></tr></table>`;
}

function compactContacts(fields = [], tones) {
  return fields
    .filter(f => f && f.value)
    .slice(0, 2)
    .map(f => {
      const href = safeUrl(f.href);
      const text = escapeHTML(f.value);
      return href
        ? `<a href="${href}" style="color: ${tones.secondary}; text-decoration: none;">${text}</a>`
        : `<span style="color: ${tones.secondary};">${text}</span>`;
    })
    .join('&nbsp;&nbsp;&middot;&nbsp;&nbsp;');
}

function textBlock(state, cfg, format) {
  const tones = tonesFor(cfg.bodyBg);
  const align = format === 'portrait' ? 'center' : 'left';
  const accent = state.accentColor;
  const titleColor = getContrastRatio(cfg.bodyBg, accent) >= 3 ? accent : tones.secondary;
  const titleAttr = getTitleStyleAttr(state.titleStyle, titleColor);
  const baseName = state.nameFontSize || 19;
  const nameSize = format === 'compact' ? Math.max(14, baseName - 3) : baseName;

  const head = `
    <div style="margin: 0 0 2px 0; font-size: ${nameSize}px; font-weight: 700; color: ${tones.primary}; letter-spacing: -0.2px; line-height: 1.2; text-align: ${align};">${escapeHTML(state.fullName)}</div>
    <div style="font-size: 12px; font-weight: 600; letter-spacing: 0.2px; text-align: ${align}; ${titleAttr}">${escapeHTML(state.jobTitle)}</div>`;

  if (format === 'compact') {
    const line = compactContacts(state.contactFields, tones);
    return `${head}${line ? `<div style="margin-top: 6px; font-size: 11px; line-height: 1.4; text-align: left;">${line}</div>` : ''}`;
  }

  const rows = renderContactRows(state.contactFields, accent, tones.secondary, tones.primary, cfg.bodyBg);
  const contacts = rows
    ? `<table role="presentation"${align === 'center' ? ' align="center"' : ''} cellpadding="0" cellspacing="0" border="0">${rows}</table>`
    : '';
  const buttons = renderActionButtons(state.buttons, state);
  return `${head}${ruleBlock(accent, align)}${contacts}${buttons}`;
}

function topBarRow(cfg, cols) {
  if (!cfg.topBar) return '';
  return `<tr><td colspan="${cols}" height="5" bgcolor="${cfg.topBar}" style="height: 5px; line-height: 5px; font-size: 0; background-color: ${cfg.topBar};">&nbsp;</td></tr>`;
}

function cornerCell(cfg) {
  if (!cfg.corner) return '';
  return `<td width="44" valign="top" bgcolor="${cfg.bodyBg}" style="width: 44px; ${cfg.bodyStyle}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right"><tr><td width="44" height="44" bgcolor="${cfg.corner}" style="width: 44px; height: 44px; font-size: 0; line-height: 0; background-color: ${cfg.corner}; border-radius: 0 0 0 44px;">&nbsp;</td></tr></table></td>`;
}

function buildDesign(state, format, cfg) {
  const photo = renderPhoto(state, cfg.photo, format);
  const radius = state.borderRadius !== undefined ? state.borderRadius : 16;
  const requested = (state.maxWidth && state.maxWidth !== 680) ? state.maxWidth : FORMAT_WIDTH[format];
  const target = format === 'portrait' ? Math.min(requested, PORTRAIT_MAX_WIDTH) : requested;
  const widthCfg = getTableWidthConfig({ ...state, maxWidth: target }, target, 240);
  const border = getBorderColor({ bgColor: cfg.bodyBg });
  const text = textBlock(state, cfg, format);
  const sideBg = `bgcolor="${cfg.sideBg}"`;
  const bodyBg = `bgcolor="${cfg.bodyBg}"`;

  const wrapOpen = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${widthCfg.widthAttr}" style="${widthCfg.widthStyle} margin: 0; border-collapse: separate; ${cfg.bodyStyle} border: 1px solid ${border}; border-radius: ${radius}px; font-family: ${getFontFamily(state.fontFamily)}; overflow: hidden;">`;

  if (format === 'portrait') {
    const edge = cfg.sideEdge ? `border-bottom: 4px solid ${cfg.sideEdge};` : '';
    return `
${wrapOpen}
  ${topBarRow(cfg, 1)}
  <tr>
    <td ${sideBg} align="center" valign="middle" style="padding: 22px 16px 16px 16px; ${cfg.sideStyle} ${edge}">${photo.html}</td>
  </tr>
  <tr>
    <td ${bodyBg} align="center" valign="top" style="padding: 16px 22px 22px 22px; ${cfg.bodyStyle}">${text}</td>
  </tr>
</table>`.trim();
  }

  const compact = format === 'compact';
  const sideW = photo.size + (compact ? 28 : 44);
  const edge = cfg.sideEdge ? `border-right: 4px solid ${cfg.sideEdge};` : '';
  const sidePad = compact ? '12px 14px' : '20px 22px';
  const bodyPad = compact ? '12px 16px' : '18px 24px';
  const corner = compact ? '' : cornerCell(cfg);
  const cols = corner ? 3 : 2;

  return `
${wrapOpen}
  ${topBarRow(cfg, cols)}
  <tr>
    <td ${sideBg} width="${sideW}" align="center" valign="middle" style="width: ${sideW}px; padding: ${sidePad}; ${cfg.sideStyle} ${edge}">${photo.html}</td>
    <td ${bodyBg} valign="middle" style="padding: ${bodyPad}; ${cfg.bodyStyle}">${text}</td>
    ${corner}
  </tr>
</table>`.trim();
}

/**
 * Renders a non-classic design. Returns null when the design is unknown so the
 * caller can fall back to the classic layouts.
 */
export function renderDesignHTML(state) {
  const cfg = familyConfig(state.design, state);
  if (!cfg) return null;
  const format = FORMAT_WIDTH[state.format] ? state.format : 'landscape';
  return buildDesign(state, format, cfg);
}

/**
 * Generates every format for the current design in one call.
 */
export function renderAllFormats(state = DEFAULT_SIGNATURE_STATE) {
  return DESIGN_FORMATS.reduce((acc, { id }) => {
    acc[id] = renderSignatureHTML({ ...state, format: id });
    return acc;
  }, {});
}
