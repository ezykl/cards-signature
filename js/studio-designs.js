/**
 * Signature Studio - Design Families
 *
 * Art-directed designs that each render in three formats (landscape, portrait, compact).
 * Everything in renderDesignHTML emits email-safe table markup (inline CSS, bgcolor
 * fallbacks, no SVG, no clip-path). Decorative shapes degrade gracefully: rounded
 * corners become square in Outlook, but layout and colour-blocking survive.
 *
 * For pixel-perfect banner/PNG export, renderDesignArtSVG emits a standalone SVG
 * banner with geometric polygons, hexagon clipPaths, concentric arcs, and dot grids.
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
  { id: 'teal-ring', label: 'Teal Ring', blurb: 'Clean card, thick photo ring' },
  { id: 'sky-diagonal', label: 'Sky Wedge', blurb: 'Dual-tone split, double ring' },
  { id: 'slate-hex', label: 'Slate Chamfer', blurb: 'Dark slate, framed badge' },
  { id: 'sunset-gradient', label: 'Sunset Gradient', blurb: 'Rich gradient, contrast panel' },
  { id: 'violet-pill', label: 'Capsule Band', blurb: 'Pill container, vertical split' }
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
  const accent = state.accentColor || '#00d2ff';
  const themed = getBackgroundStyle(state);
  const themedBg = state.bgColor || '#0f172a';
  const gradEnd = state.bgGradientEnd || '#1e293b';

  switch (id) {
    case 'lime-panel':
      return {
        sideStyle: `background-color: ${accent};`, sideBg: accent,
        bodyStyle: themed, bodyBg: themedBg,
        photo: { shape: 'circle', ring: 4, ringColor: '#ffffff', pad: 0 },
        topBar: null, bottomBar: null, corner: null, sideEdge: null,
        ruleStyle: 'solid', pillWrap: false, bodyDivider: null
      };
    case 'ocean-split':
      return {
        sideStyle: 'background-color: #f1f5f9;', sideBg: '#f1f5f9',
        bodyStyle: themed, bodyBg: themedBg,
        photo: { shape: 'circle', ring: 4, ringColor: accent, pad: 0 },
        topBar: null, bottomBar: null, corner: null, sideEdge: accent,
        ruleStyle: 'solid', pillWrap: false, bodyDivider: null
      };
    case 'midnight-corner':
      return {
        sideStyle: themed, sideBg: themedBg,
        bodyStyle: themed, bodyBg: themedBg,
        photo: { shape: 'rounded', ring: 3, ringColor: accent, pad: 0 },
        topBar: accent, bottomBar: null, corner: accent, sideEdge: null,
        ruleStyle: 'solid', pillWrap: false, bodyDivider: null
      };
    case 'teal-ring': {
      const surface = isLight(themedBg) ? themedBg : '#ffffff';
      return {
        sideStyle: `background-color: ${surface};`, sideBg: surface,
        bodyStyle: `background-color: ${surface};`, bodyBg: surface,
        photo: { shape: 'circle', ring: 5, ringColor: accent, pad: 3, padBg: '#ffffff' },
        topBar: accent, bottomBar: null, corner: null, sideEdge: null,
        ruleStyle: 'solid', pillWrap: false, bodyDivider: null
      };
    }
    case 'sky-diagonal': {
      const surface = isLight(themedBg) ? themedBg : '#f8fafc';
      const panelBg = isLight(themedBg) ? gradEnd : themedBg;
      return {
        sideStyle: `background-color: ${panelBg}; background-image: linear-gradient(150deg, ${panelBg} 0%, ${accent} 100%);`,
        sideBg: panelBg,
        bodyStyle: `background-color: ${surface};`,
        bodyBg: surface,
        photo: { shape: 'circle', ring: 3, ringColor: accent, pad: 4, padBg: '#ffffff' },
        topBar: accent, bottomBar: null, corner: accent, sideEdge: accent,
        ruleStyle: 'double', pillWrap: false, bodyDivider: null
      };
    }
    case 'slate-hex': {
      const sideSurface = isLight(themedBg) ? '#0f172a' : gradEnd;
      return {
        sideStyle: `background-color: ${sideSurface};`,
        sideBg: sideSurface,
        bodyStyle: themed,
        bodyBg: themedBg,
        photo: { shape: 'square', ring: 3, ringColor: accent, pad: 4, padBg: sideSurface },
        topBar: null, bottomBar: accent, corner: null, sideEdge: accent,
        ruleStyle: 'dashed', pillWrap: false, bodyDivider: null
      };
    }
    case 'sunset-gradient': {
      const gradStyle = `background-color: ${themedBg}; background-image: linear-gradient(135deg, ${themedBg} 0%, ${accent} 100%);`;
      const contrastSide = isLight(themedBg) ? '#0f172a' : '#ffffff';
      return {
        sideStyle: `background-color: ${contrastSide};`,
        sideBg: contrastSide,
        bodyStyle: gradStyle,
        bodyBg: themedBg,
        photo: { shape: 'circle', ring: 4, ringColor: accent, pad: 2, padBg: contrastSide },
        topBar: null, bottomBar: null, corner: null, sideEdge: null,
        ruleStyle: 'solid', pillWrap: false, bodyDivider: null
      };
    }
    case 'violet-pill': {
      const pillStyle = `background-color: ${themedBg}; background-image: linear-gradient(120deg, ${themedBg} 0%, ${gradEnd} 65%, ${accent} 100%);`;
      return {
        sideStyle: `background-color: ${themedBg};`,
        sideBg: themedBg,
        bodyStyle: pillStyle,
        bodyBg: themedBg,
        photo: { shape: 'circle', ring: 3, ringColor: accent, pad: 3, padBg: themedBg },
        topBar: null, bottomBar: null, corner: null, sideEdge: null,
        ruleStyle: 'none', pillWrap: true, bodyDivider: accent
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

function ruleBlock(accent, align, ruleStyle = 'solid') {
  if (ruleStyle === 'none') return '';
  const alignAttr = align === 'center' ? ' align="center"' : '';
  if (ruleStyle === 'dashed') {
    return `<table role="presentation"${alignAttr} cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0;"><tr><td width="56" height="2" style="width: 56px; height: 2px; line-height: 2px; font-size: 0; border-bottom: 2px dashed ${accent};">&nbsp;</td></tr></table>`;
  }
  if (ruleStyle === 'double') {
    return `<table role="presentation"${alignAttr} cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0;"><tr><td width="28" height="3" bgcolor="${accent}" style="width: 28px; height: 3px; line-height: 3px; font-size: 0; background-color: ${accent};">&nbsp;</td><td width="6" style="width: 6px; font-size: 0;">&nbsp;</td><td width="10" height="3" bgcolor="${accent}" style="width: 10px; height: 3px; line-height: 3px; font-size: 0; background-color: ${accent};">&nbsp;</td></tr></table>`;
  }
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

  if (cfg.bodyDivider && format === 'landscape') {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right: 16px; border-right: 2px solid ${cfg.bodyDivider};">${head}${buttons}</td><td valign="middle" style="padding-left: 16px;">${contacts}</td></tr></table>`;
  }

  return `${head}${ruleBlock(accent, align, cfg.ruleStyle)}${contacts}${buttons}`;
}

function topBarRow(cfg, cols) {
  if (!cfg.topBar) return '';
  return `<tr><td colspan="${cols}" height="5" bgcolor="${cfg.topBar}" style="height: 5px; line-height: 5px; font-size: 0; background-color: ${cfg.topBar};">&nbsp;</td></tr>`;
}

function bottomBarRow(cfg, cols) {
  if (!cfg.bottomBar) return '';
  return `<tr><td colspan="${cols}" height="5" bgcolor="${cfg.bottomBar}" style="height: 5px; line-height: 5px; font-size: 0; background-color: ${cfg.bottomBar};">&nbsp;</td></tr>`;
}

function cornerCell(cfg) {
  if (!cfg.corner) return '';
  return `<td width="44" valign="top" bgcolor="${cfg.bodyBg}" style="width: 44px; ${cfg.bodyStyle}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right"><tr><td width="44" height="44" bgcolor="${cfg.corner}" style="width: 44px; height: 44px; font-size: 0; line-height: 0; background-color: ${cfg.corner}; border-radius: 0 0 0 44px;">&nbsp;</td></tr></table></td>`;
}

function buildDesign(state, format, cfg) {
  const photo = renderPhoto(state, cfg.photo, format);
  const baseRadius = state.borderRadius !== undefined ? state.borderRadius : 16;
  const radius = (cfg.pillWrap && format !== 'portrait') ? 999 : baseRadius;
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
  ${bottomBarRow(cfg, 1)}
</table>`.trim();
  }

  const compact = format === 'compact';
  const sideW = photo.size + (compact ? 28 : 44);
  const edge = cfg.sideEdge ? `border-right: 4px solid ${cfg.sideEdge};` : '';
  const sidePad = compact ? '12px 14px' : (cfg.pillWrap ? '18px 18px 18px 26px' : '20px 22px');
  const bodyPad = compact ? '12px 16px' : (cfg.pillWrap ? '18px 28px 18px 20px' : '18px 24px');
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
  ${bottomBarRow(cfg, cols)}
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

/**
 * Tier 2 Full-Art SVG Generator:
 * Produces a self-contained SVG banner with true diagonal wedges, hexagon clipPaths,
 * concentric rings, and decorative dot grids matching the reference template sheet,
 * dynamically colored by the user's active theme palette.
 */
export function renderDesignArtSVG(state = DEFAULT_SIGNATURE_STATE) {
  const safe = { ...DEFAULT_SIGNATURE_STATE, ...(state || {}) };
  const format = FORMAT_WIDTH[safe.format] ? safe.format : 'landscape';
  const design = safe.design || 'lime-panel';
  const width = format === 'portrait' ? 340 : format === 'compact' ? 480 : 640;
  const height = format === 'portrait' ? 380 : format === 'compact' ? 120 : 210;
  const radius = safe.borderRadius !== undefined ? safe.borderRadius : 16;
  const rx = (design === 'violet-pill' && format !== 'portrait') ? Math.round(height / 2) : radius;

  const bg = safe.bgColor || '#0f172a';
  const gradEnd = safe.bgGradientEnd || '#1e293b';
  const accent = safe.accentColor || '#00d2ff';
  const tones = tonesFor(bg);
  const name = escapeHTML(safe.fullName || 'Alex Rivera');
  const role = escapeHTML(safe.jobTitle || 'Product Engineer');
  const initials = escapeHTML(initialsOf(safe.fullName));

  const contacts = (safe.contactFields || [])
    .filter(f => f && f.value)
    .slice(0, format === 'compact' ? 2 : 3)
    .map(f => escapeHTML(f.value));

  const avatarR = format === 'compact' ? 32 : format === 'portrait' ? 48 : 54;
  const avatarCx = format === 'portrait' ? Math.round(width / 2) : format === 'compact' ? 62 : 96;
  const avatarCy = format === 'portrait' ? 92 : Math.round(height / 2);

  let decorSvg = '';
  if (design === 'lime-panel' || design === 'sky-diagonal') {
    const wedgeRight = format === 'portrait' ? width : Math.round(width * 0.34);
    const slant = format === 'portrait' ? 0 : 38;
    decorSvg = `<polygon points="0,0 ${wedgeRight},0 ${ Math.max(0, wedgeRight - slant)},${height} 0,${height}" fill="${accent}" opacity="0.92" />
      <circle cx="${width - 24}" cy="24" r="42" fill="${accent}" opacity="0.18" />`;
  } else if (design === 'ocean-split') {
    const splitX = format === 'portrait' ? width : Math.round(width * 0.32);
    decorSvg = `<rect x="0" y="0" width="${splitX}" height="${ format === 'portrait' ? 156 : height}" fill="#f1f5f9" />
      <line x1="${format === 'portrait' ? 0 : splitX}" y1="${format === 'portrait' ? 156 : 0}" x2="${splitX}" y2="${format === 'portrait' ? 156 : height}" stroke="${accent}" stroke-width="4" />`;
  } else if (design === 'midnight-corner') {
    decorSvg = `<rect x="0" y="0" width="${width}" height="6" fill="${accent}" />
      <path d="M ${width - 64} 0 L ${width} 0 L ${width} 64 Q ${width - 64} 64 ${width - 64} 0 Z" fill="${accent}" />`;
  } else if (design === 'teal-ring') {
    decorSvg = `<circle cx="${avatarCx}" cy="${avatarCy}" r="${avatarR + 12}" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="8 5" opacity="0.65" />
      <rect x="0" y="0" width="${width}" height="5" fill="${accent}" />`;
  } else if (design === 'slate-hex') {
    decorSvg = `<rect x="0" y="${height - 6}" width="${width}" height="6" fill="${accent}" />
      <polygon points="${width - 90},0 ${width},0 ${width},90" fill="${accent}" opacity="0.22" />`;
  } else if (design === 'violet-pill') {
    decorSvg = `<circle cx="${avatarCx}" cy="${avatarCy}" r="${avatarR + 9}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5" />`;
  }

  // Hexagonal points for slate-hex avatar frame
  const hexPoints = (cx, cy, r) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const avatarFrame = design === 'slate-hex'
    ? `<polygon points="${hexPoints(avatarCx, avatarCy, avatarR + 5)}" fill="none" stroke="${accent}" stroke-width="4" />
       <polygon points="${hexPoints(avatarCx, avatarCy, avatarR)}" fill="${accent}" />`
    : `<circle cx="${avatarCx}" cy="${avatarCy}" r="${avatarR + 4}" fill="none" stroke="${accent}" stroke-width="4" />
       <circle cx="${avatarCx}" cy="${avatarCy}" r="${avatarR}" fill="${accent}" />`;

  const textX = format === 'portrait' ? Math.round(width / 2) : avatarCx + avatarR + 34;
  const textAnchor = format === 'portrait' ? 'middle' : 'start';
  const nameY = format === 'portrait' ? 188 : format === 'compact' ? 48 : 66;
  const roleY = nameY + 22;
  const ruleX = format === 'portrait' ? Math.round(width / 2) - 22 : textX;
  const ruleY = roleY + 12;

  const contactLines = contacts.map((val, idx) => {
    const cy = ruleY + 26 + idx * 20;
    return `<text x="${textX}" y="${cy}" text-anchor="${textAnchor}" fill="${tones.secondary}" font-family="Arial, sans-serif" font-size="12.5">${val}</text>`;
  }).join('\n      ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${name} — ${design} (${format})">
  <defs>
    <linearGradient id="bgGrad-${design}-${format}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="${design === 'sunset-gradient' ? accent : gradEnd}" />
    </linearGradient>
    <clipPath id="cardClip-${design}-${format}">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${rx}" />
    </clipPath>
  </defs>
  <g clip-path="url(#cardClip-${design}-${format})">
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bgGrad-${design}-${format})" />
    ${decorSvg}
    ${avatarFrame}
    <text x="${avatarCx}" y="${avatarCy + 8}" text-anchor="middle" fill="${tonesFor(accent).primary}" font-family="Arial, sans-serif" font-weight="700" font-size="${Math.round(avatarR * 0.48)}">${initials}</text>
    <text x="${textX}" y="${nameY}" text-anchor="${textAnchor}" fill="${tones.primary}" font-family="Arial, sans-serif" font-weight="700" font-size="${format === 'compact' ? 17 : 21}">${name}</text>
    <text x="${textX}" y="${roleY}" text-anchor="${textAnchor}" fill="${accent}" font-family="Arial, sans-serif" font-weight="600" font-size="12.5">${role}</text>
    <rect x="${ruleX}" y="${ruleY}" width="44" height="3" rx="1.5" fill="${accent}" />
    ${contactLines}
  </g>
</svg>`;
}
