/**
 * Signature Studio - Email Template Generator
 * Produces email-client safe table markup with inline CSS and hosted PNG icons.
 */

export const THEME_PRESETS = {
  'developer-cyan': {
    name: 'Developer Cyan',
    bgColor: '#000440',
    bgType: 'solid',
    bgGradientEnd: '#00086b',
    bgGradientAngle: 135,
    accentColor: '#38bdf8',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#93c5fd',
    textColorMuted: '#cbd5e1',
    buttonBg: '#121829',
    buttonBorder: 'rgba(255, 255, 255, 0.16)'
  },
  'cosmic-blue': {
    name: 'Cosmic Blue',
    bgColor: '#070913',
    bgType: 'gradient',
    bgGradientEnd: '#1e1b4b',
    bgGradientAngle: 135,
    accentColor: '#60a5fa',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#bfdbfe',
    textColorMuted: '#94a3b8',
    buttonBg: '#0f172a',
    buttonBorder: 'rgba(96, 165, 250, 0.3)'
  },
  'slate-tech': {
    name: 'Slate Tech',
    bgColor: '#0f172a',
    bgType: 'solid',
    bgGradientEnd: '#1e293b',
    bgGradientAngle: 135,
    accentColor: '#38bdf8',
    textColorPrimary: '#f8fafc',
    textColorSecondary: '#94a3b8',
    textColorMuted: '#64748b',
    buttonBg: '#1e293b',
    buttonBorder: 'rgba(255, 255, 255, 0.12)'
  },
  'royal-indigo': {
    name: 'Royal Indigo',
    bgColor: '#180033',
    bgType: 'gradient',
    bgGradientEnd: '#3b0764',
    bgGradientAngle: 135,
    accentColor: '#c084fc',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#e9d5ff',
    textColorMuted: '#d8b4fe',
    buttonBg: '#2e1065',
    buttonBorder: 'rgba(192, 132, 252, 0.35)'
  },
  'emerald-neon': {
    name: 'Emerald Neon',
    bgColor: '#022c22',
    bgType: 'solid',
    bgGradientEnd: '#064e3b',
    bgGradientAngle: 135,
    accentColor: '#34d399',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#a7f3d0',
    textColorMuted: '#6ee7b7',
    buttonBg: '#064e3b',
    buttonBorder: 'rgba(52, 211, 153, 0.3)'
  },
  'minimal-light': {
    name: 'Minimal Light',
    bgColor: '#ffffff',
    bgType: 'solid',
    bgGradientEnd: '#f1f5f9',
    bgGradientAngle: 135,
    accentColor: '#0284c7',
    textColorPrimary: '#0f172a',
    textColorSecondary: '#475569',
    textColorMuted: '#64748b',
    buttonBg: '#f8fafc',
    buttonBorder: '#cbd5e1'
  },
  'sunset-crimson': {
    name: 'Sunset Crimson',
    bgColor: '#1c0712',
    bgType: 'gradient',
    bgGradientEnd: '#4c0519',
    bgGradientAngle: 135,
    accentColor: '#fb7185',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#fecdd3',
    textColorMuted: '#fda4af',
    buttonBg: '#3b0717',
    buttonBorder: 'rgba(251, 113, 133, 0.35)'
  },
  'cyber-amber': {
    name: 'Cyber Amber',
    bgColor: '#181204',
    bgType: 'gradient',
    bgGradientEnd: '#362106',
    bgGradientAngle: 135,
    accentColor: '#fbbf24',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#fde68a',
    textColorMuted: '#f59e0b',
    buttonBg: '#291804',
    buttonBorder: 'rgba(251, 191, 36, 0.35)'
  },
  'rose-gold': {
    name: 'Rose Gold',
    bgColor: '#180f15',
    bgType: 'mesh',
    bgGradientEnd: '#36182a',
    bgGradientAngle: 135,
    accentColor: '#f472b6',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#fbcfe8',
    textColorMuted: '#f43f5e',
    buttonBg: '#2e1324',
    buttonBorder: 'rgba(244, 114, 182, 0.35)'
  },
  'nordic-frost': {
    name: 'Nordic Frost',
    bgColor: '#061626',
    bgType: 'ambient',
    bgGradientEnd: '#0f2942',
    bgGradientAngle: 135,
    accentColor: '#38bdf8',
    textColorPrimary: '#f0f9ff',
    textColorSecondary: '#bae6fd',
    textColorMuted: '#7dd3fc',
    buttonBg: '#0c2338',
    buttonBorder: 'rgba(56, 189, 248, 0.35)'
  },
  'aurora-green': {
    name: 'Aurora Green',
    bgColor: '#031c18',
    bgType: 'mesh',
    bgGradientEnd: '#073d32',
    bgGradientAngle: 135,
    accentColor: '#4ade80',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#bbf7d0',
    textColorMuted: '#86efac',
    buttonBg: '#0a3028',
    buttonBorder: 'rgba(74, 222, 128, 0.35)'
  },
  'monochrome-pro': {
    name: 'Monochrome Pro',
    bgColor: '#09090b',
    bgType: 'lines',
    bgGradientEnd: '#18181b',
    bgGradientAngle: 135,
    accentColor: '#e4e4e7',
    textColorPrimary: '#fafafa',
    textColorSecondary: '#d4d4d8',
    textColorMuted: '#a1a1aa',
    buttonBg: '#18181b',
    buttonBorder: 'rgba(255, 255, 255, 0.2)'
  },
  'terracotta-warm': {
    name: 'Terracotta Warm',
    bgColor: '#1a0d0a',
    bgType: 'gradient',
    bgGradientEnd: '#3d1c14',
    bgGradientAngle: 135,
    accentColor: '#fb923c',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#fed7aa',
    textColorMuted: '#f97316',
    buttonBg: '#2d140e',
    buttonBorder: 'rgba(251, 146, 60, 0.35)'
  },
  'neo-tokyo': {
    name: 'Neo Tokyo',
    bgColor: '#140524',
    bgType: 'gradient',
    bgGradientEnd: '#29064a',
    bgGradientAngle: 135,
    accentColor: '#ec4899',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#f5d0fe',
    textColorMuted: '#e879f9',
    buttonBg: '#22083d',
    buttonBorder: 'rgba(236, 72, 153, 0.35)'
  },
  'sand-dune': {
    name: 'Sand Dune',
    bgColor: '#fefce8',
    bgType: 'solid',
    bgGradientEnd: '#fef08a',
    bgGradientAngle: 135,
    accentColor: '#b45309',
    textColorPrimary: '#1c1917',
    textColorSecondary: '#57534e',
    textColorMuted: '#78716c',
    buttonBg: '#ffffff',
    buttonBorder: '#e7e5e4'
  },
  'ocean-abyss': {
    name: 'Ocean Abyss',
    bgColor: '#02182b',
    bgType: 'dots',
    bgGradientEnd: '#06355c',
    bgGradientAngle: 135,
    accentColor: '#2dd4bf',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#99f6e4',
    textColorMuted: '#5eead4',
    buttonBg: '#052b4a',
    buttonBorder: 'rgba(45, 212, 191, 0.35)'
  }
};

export const CONTACT_ICON_MAP = {
  phone: 'phone.png',
  mobile: 'phone.png',
  email: 'mail.png',
  location: 'marker.png',
  address: 'marker.png',
  map: 'marker.png',
  website: 'domain.png',
  calendar: 'calendar.png',
  linkedin: 'linkedin--v1.png',
  github: 'github.png',
  custom: 'star.png',
  portfolio: 'domain.png'
};

export const BUTTON_SHAPES = {
  rounded: 8,
  pill: 999,
  sharp: 2
};

export const BUTTON_ICON_MAP = {
  // Dev & Tools
  github: 'github.png',
  code: 'source-code.png',
  terminal: 'console.png',
  figma: 'figma.png',
  // Social & Media
  linkedin: 'linkedin--v1.png',
  x: 'twitter.png',
  twitter: 'twitter.png',
  youtube: 'youtube-play.png',
  instagram: 'instagram-new.png',
  dribbble: 'dribbble.png',
  behance: 'behance.png',
  medium: 'medium-monogram.png',
  substack: 'bookmark-ribbon.png',
  spotify: 'spotify.png',
  // Direct & Booking
  calendly: 'calendar.png',
  calendar: 'calendar.png',
  whatsapp: 'whatsapp.png',
  telegram: 'telegram-app.png',
  discord: 'discord.png',
  email: 'mail.png',
  phone: 'phone.png',
  chat: 'chat.png',
  // Actions & General
  globe: 'domain.png',
  website: 'domain.png',
  download: 'download.png',
  document: 'document.png',
  location: 'marker.png',
  star: 'star.png',
  link: 'link.png'
};

export const DEFAULT_SIGNATURE_STATE = {
  layout: 'landscape-v2', // 'landscape-v2' | 'compact-card' | 'minimal-row'
  widthMode: 'responsive', // 'responsive' | 'fixed'
  maxWidth: 680,
  borderRadius: 16,
  fullName: 'Ezekiel P. Villadolid',
  jobTitle: 'Software Developer + UI/UX | Graphic Design',
  logoUrl: 'https://raw.githubusercontent.com/ezykl/Portfolio/refs/heads/master/public/assets/logo.png',
  contactFields: [
    { id: 'c1', type: 'phone', label: 'Phone', value: '09939389798', href: 'tel:09939389798' },
    { id: 'c2', type: 'email', label: 'Email', value: 'zyk.graphics@gmail.com', href: 'mailto:zyk.graphics@gmail.com' },
    { id: 'c3', type: 'location', label: 'Location', value: 'M. Logarta Street, San Roque, Cebu City', href: '' }
  ],
  buttons: [
    { id: 'b1', icon: 'github', label: 'GitHub', url: 'https://github.com/ezykl', style: 'dark' },
    { id: 'b2', icon: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ezekiel-villadolid', style: 'brand' },
    { id: 'b3', icon: 'download', label: 'Download CV', url: 'https://raw.githubusercontent.com/ezykl/cards-signature/main/cards/ezekiel-villadolid/Villadolid_Ezekiel.pdf', style: 'accent' }
  ],
  themePreset: 'developer-cyan',
  bgColor: '#000440',
  bgType: 'solid', // 'solid' | 'gradient' | 'ambient' | 'mesh' | 'dots' | 'grid' | 'lines'
  bgGradientEnd: '#00086b',
  bgGradientAngle: 135,
  accentColor: '#38bdf8',
  textColorPrimary: '#ffffff',
  textColorSecondary: '#93c5fd',
  textColorMuted: '#cbd5e1',
  buttonBg: '#121829',
  buttonBorder: 'rgba(255, 255, 255, 0.16)',
  fontFamily: 'sans',
  nameFontSize: 19,
  titleStyle: 'regular',
  buttonShape: 'rounded'
};

export const FONT_STACKS = {
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
  mono: "Consolas, 'Courier New', Courier, monospace",
  grotesk: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', Tahoma, sans-serif"
};

export function getFontFamily(fontKey) {
  return FONT_STACKS[fontKey] || FONT_STACKS.sans;
}

export function getTitleStyleAttr(styleKey, baseColor = '#93c5fd') {
  let extra = '';
  if (styleKey === 'uppercase') {
    extra = 'text-transform: uppercase; letter-spacing: 0.8px; font-size: 11px;';
  } else if (styleKey === 'italic') {
    extra = 'font-style: italic;';
  }
  return `color: ${baseColor}; ${extra}`;
}

/** Escape user-provided text before it becomes part of exported HTML. */
function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

/** Only allow URL schemes supported by email clients and this editor. */
function safeUrl(value, fallback = '') {
  const url = String(value || '').trim();
  if (!url) return fallback;
  return /^(https?:|mailto:|tel:)/i.test(url) ? escapeHTML(url) : fallback;
}

function safeHex(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? value : fallback;
}

/**
 * Strips '#' from hex code for URL interpolation.
 */
function cleanHex(color) {
  return safeHex(color, '#38bdf8').slice(1);
}

/**
 * Calculates WCAG 2.1 relative luminance and contrast ratio between two hex colors.
 */
export function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  const a = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex || '').trim());
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  };
}

/**
 * Solid (non-alpha) border color: base blended 14% toward white. rgba() borders are dropped by several email clients.
 */
function getBorderColor(state) {
  const rgb = hexToRgb(safeHex(state.bgColor, '#000440')) || { r: 0, g: 4, b: 64 };
  const mix = c => Math.round(c + (255 - c) * 0.14).toString(16).padStart(2, '0');
  return `#${mix(rgb.r)}${mix(rgb.g)}${mix(rgb.b)}`;
}

/**
 * Computes background inline CSS safely with bulletproof fallback for email clients.
 */
function getBackgroundStyle(state) {
  const bg = safeHex(state.bgColor, '#000440');
  const end = safeHex(state.bgGradientEnd, '#00086b');
  const accent = safeHex(state.accentColor, '#38bdf8');
  const angle = Number.isFinite(Number(state.bgGradientAngle)) ? Math.max(0, Math.min(360, Number(state.bgGradientAngle))) : 135;

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
}

/**
 * Builds contact rows markup with accent-colored hosted PNG icons.
 */
function renderContactRows(contactFields, accentColor) {
  if (!contactFields || contactFields.length === 0) return '';
  const hex = cleanHex(accentColor);

  return contactFields.map(field => {
    const iconFile = CONTACT_ICON_MAP[field.type] || 'star.png';
    const iconUrl = `https://img.icons8.com/material-rounded/48/${hex}/${iconFile}`;

    const href = safeUrl(field.href);
    const textContent = href ? `
      <a href="${href}" style="font-size: 11.5px; color: #e2e8f0; text-decoration: none; font-weight: 500; word-break: break-all;">
        ${escapeHTML(field.value)}
      </a>
    ` : `
      <span style="font-size: 11.5px; color: #cbd5e1; font-weight: 400; line-height: 1.3;">
        ${escapeHTML(field.value)}
      </span>
    `;

    return `
      <tr>
        <td style="width: 20px; padding: 2.5px 0; vertical-align: middle;">
          <img src="${iconUrl}" width="13" height="13" alt="${escapeHTML(field.label || field.type)}" style="display: block; border: 0; outline: none; width: 13px; height: 13px;" />
        </td>
        <td style="padding: 2.5px 0 2.5px 6px; vertical-align: middle;">
          ${textContent.trim()}
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Builds modular action buttons row markup.
 */
function renderActionButtons(buttons, state) {
  if (!buttons || buttons.length === 0) return '';

  const count = buttons.length;
  const colWidth = `${(100 / count).toFixed(2)}%`;

  const cells = buttons.map((btn, index) => {
    const isFirst = index === 0;
    const isLast = index === count - 1;
    let paddingStyle = 'padding: 0 3px;';
    if (count === 1) {
      paddingStyle = 'padding: 0;';
    } else if (isFirst) {
      paddingStyle = 'padding-right: 4px;';
    } else if (isLast) {
      paddingStyle = 'padding-left: 4px;';
    }

    let bgStyle = 'background-color: #121829; background-image: linear-gradient(180deg, #1b233a 0%, #0f1524 100%); border: 1px solid rgba(255, 255, 255, 0.16); color: #f8fafc;';
    if (btn.style === 'brand') {
      bgStyle = 'background-color: #0a66c2; background-image: linear-gradient(180deg, #0d73d9 0%, #0855a4 100%); border: 1px solid #1f82e5; color: #ffffff;';
    } else if (btn.style === 'accent') {
      const accent = safeHex(state.accentColor, '#38bdf8');
      bgStyle = `background-color: ${accent}; background-image: linear-gradient(180deg, ${accent} 0%, rgba(0, 0, 0, 0.35) 100%); border: 1px solid rgba(255, 255, 255, 0.25); color: #ffffff;`;
    } else if (btn.style === 'outline') {
      const accent = safeHex(state.accentColor, '#38bdf8');
      bgStyle = `background-color: transparent; border: 1px solid ${accent}; color: ${accent};`;
    }

    let radius = 8;
    if (state.buttonShape === 'pill') {
      radius = 999;
    } else if (state.buttonShape === 'sharp') {
      radius = 2;
    }

    const iconColorHex = btn.style === 'outline' ? cleanHex(state.accentColor) : 'ffffff';
    const iconFile = BUTTON_ICON_MAP[btn.icon] || (btn.icon ? `${btn.icon}.png` : null);
    const iconTag = (iconFile && btn.icon !== 'none') ? `
      <img src="https://img.icons8.com/material-rounded/48/${iconColorHex}/${iconFile}" alt="${escapeHTML(btn.label)}" width="12" height="12" style="display: inline-block; vertical-align: -2px; margin-right: 4px; width: 12px; height: 12px; border: 0;" />
    ` : '';

    return `
      <td style="${paddingStyle} width: ${colWidth}; vertical-align: middle;">
        <a href="${safeUrl(btn.url, '#')}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; ${bgStyle} font-size: 10.5px; font-weight: 600; text-decoration: none; padding: 7px 6px; border-radius: ${radius}px; line-height: 14px; white-space: nowrap;">
          ${iconTag.trim()}${escapeHTML(btn.label)}
        </a>
      </td>
    `;
  }).join('');

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 14px;">
      <tr>
        ${cells}
      </tr>
    </table>
  `;
}

/**
 * Computes table width attribute and inline CSS based on widthMode.
 */
function getTableWidthConfig(state, defaultWidth = 680, minResponsiveWidth = 280) {
  const isFixed = state.widthMode === 'fixed';
  const widthVal = state.maxWidth || defaultWidth;

  if (isFixed) {
    return {
      widthAttr: `${widthVal}`,
      widthStyle: `width: ${widthVal}px !important; max-width: ${widthVal}px; min-width: ${widthVal}px;`
    };
  }

  return {
    widthAttr: '100%',
    widthStyle: `width: 100% !important; max-width: ${widthVal}px; min-width: ${minResponsiveWidth}px;`
  };
}

/**
 * Renders Landscape V2 Layout
 */
function renderLandscapeV2(state) {
  const bgStyle = getBackgroundStyle(state);
  const widthCfg = getTableWidthConfig(state, 680, 280);
  const radius = state.borderRadius !== undefined ? state.borderRadius : 16;
  const contactRows = renderContactRows(state.contactFields, state.accentColor);
  const buttonsMarkup = renderActionButtons(state.buttons, state);
  const nameSize = state.nameFontSize || 19;
  const titleStyleAttr = getTitleStyleAttr(state.titleStyle, state.textColorSecondary || '#93c5fd');

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${widthCfg.widthAttr}" style="${widthCfg.widthStyle} margin: 0; border-collapse: separate; ${bgStyle} border: 1px solid ${getBorderColor(state)}; border-radius: ${radius}px; font-family: ${getFontFamily(state.fontFamily)}; overflow: hidden;">
  <tr>
    <td style="padding: 16px 22px 16px 22px; border-radius: ${radius}px;">
      <!-- Top Section: Name/Title on Left, Logo on Right -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <!-- Name & Title -->
          <td style="vertical-align: middle;">
            <div style="margin: 0 0 2px 0; font-size: ${nameSize}px; font-weight: 700; color: ${state.textColorPrimary || '#ffffff'}; letter-spacing: -0.2px; line-height: 1.2;">
              ${escapeHTML(state.fullName)}
            </div>
            <span style="display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 0.2px; ${titleStyleAttr}">
              ${escapeHTML(state.jobTitle)}
            </span>
          </td>
          ${safeUrl(state.logoUrl) ? `
          <!-- Logo (Top Right) -->
          <td align="right" style="vertical-align: middle; padding-left: 14px; width: 70px;">
            <img src="${safeUrl(state.logoUrl)}" alt="Logo" width="70" height="46" style="display: block; border: 0; outline: none; max-width: 70px; width: 100%; height: auto;" />
          </td>
          ` : ''}
        </tr>
      </table>

      <!-- Middle Section: Contact List Items -->
      ${contactRows ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 10px;">
        ${contactRows}
      </table>
      ` : ''}

      <!-- Bottom Section: Modular Buttons -->
      ${buttonsMarkup}
    </td>
  </tr>
</table>
`.trim();
}

/**
 * Renders Compact Card Layout (Vertical / Portrait)
 */
function renderCompactCard(state) {
  const bgStyle = getBackgroundStyle(state);
  const targetWidth = (state.maxWidth && state.maxWidth !== 680) ? state.maxWidth : 420;
  const widthCfg = getTableWidthConfig({ ...state, maxWidth: targetWidth }, targetWidth, 260);
  const radius = state.borderRadius !== undefined ? state.borderRadius : 16;
  const contactRows = renderContactRows(state.contactFields, state.accentColor);
  const buttonsMarkup = renderActionButtons(state.buttons, state);
  const nameSize = state.nameFontSize || 18;
  const titleStyleAttr = getTitleStyleAttr(state.titleStyle, state.textColorSecondary || '#93c5fd');

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${widthCfg.widthAttr}" style="${widthCfg.widthStyle} margin: 0; border-collapse: separate; ${bgStyle} border: 1px solid ${getBorderColor(state)}; border-radius: ${radius}px; font-family: ${getFontFamily(state.fontFamily)}; overflow: hidden;">
  <tr>
    <td style="padding: 20px; border-radius: ${radius}px; text-align: center;">
      ${safeUrl(state.logoUrl) ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom: 12px;">
            <img src="${safeUrl(state.logoUrl)}" alt="Logo" width="60" height="40" style="display: block; margin: 0 auto; border: 0; outline: none; max-width: 60px; height: auto;" />
          </td>
        </tr>
      </table>
      ` : ''}

      <div style="margin: 0 0 4px 0; font-size: ${nameSize}px; font-weight: 700; color: ${state.textColorPrimary || '#ffffff'}; line-height: 1.2;">
        ${escapeHTML(state.fullName)}
      </div>
      <span style="display: inline-block; font-size: 12px; font-weight: 600; margin-bottom: 12px; ${titleStyleAttr}">
        ${escapeHTML(state.jobTitle)}
      </span>

      ${contactRows ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 10px; text-align: left;">
        ${contactRows}
      </table>
      ` : ''}

      ${buttonsMarkup}
    </td>
  </tr>
</table>
`.trim();
}

/**
 * Renders Minimal Row Layout
 */
function renderMinimalRow(state) {
  const bgStyle = getBackgroundStyle(state);
  const widthCfg = getTableWidthConfig(state, 680, 280);
  const radius = state.borderRadius !== undefined ? state.borderRadius : 10;
  const contactRows = renderContactRows(state.contactFields, state.accentColor);
  const buttonsMarkup = renderActionButtons(state.buttons, state);
  const nameSize = state.nameFontSize || 17;
  const titleStyleAttr = getTitleStyleAttr(state.titleStyle, state.textColorSecondary || '#93c5fd');

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${widthCfg.widthAttr}" style="${widthCfg.widthStyle} margin: 0; border-collapse: separate; ${bgStyle} border: 1px solid ${getBorderColor(state)}; border-radius: ${radius}px; font-family: ${getFontFamily(state.fontFamily)}; overflow: hidden;">
  <tr>
    <td style="padding: 14px 18px; border-radius: ${radius}px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          ${safeUrl(state.logoUrl) ? `
          <td style="vertical-align: middle; padding-right: 14px; width: 50px;">
            <img src="${safeUrl(state.logoUrl)}" alt="Logo" width="50" height="34" style="display: block; border: 0; outline: none; max-width: 50px; height: auto;" />
          </td>
          ` : ''}
          <td style="vertical-align: middle;">
            <div style="font-size: ${nameSize}px; font-weight: 700; color: ${state.textColorPrimary || '#ffffff'}; line-height: 1.2;">
              ${escapeHTML(state.fullName)}
            </div>
            <div style="font-size: 11.5px; font-weight: 600; margin-top: 2px; ${titleStyleAttr}">
              ${escapeHTML(state.jobTitle)}
            </div>
          </td>
        </tr>
      </table>

      ${contactRows ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 8px;">
        ${contactRows}
      </table>
      ` : ''}

      ${buttonsMarkup}
    </td>
  </tr>
</table>
`.trim();
}

/**
 * Main export function: transforms SignatureState into email-safe table markup.
 */
export function renderSignatureHTML(state = DEFAULT_SIGNATURE_STATE) {
  const safeState = {
    ...DEFAULT_SIGNATURE_STATE,
    ...state,
    fullName: (typeof state.fullName === 'string' && state.fullName.trim() !== '') ? state.fullName : (state.fullName === '' ? 'Your Name' : DEFAULT_SIGNATURE_STATE.fullName),
    jobTitle: (typeof state.jobTitle === 'string' && state.jobTitle.trim() !== '') ? state.jobTitle : (state.jobTitle === '' ? 'Role or Team' : DEFAULT_SIGNATURE_STATE.jobTitle),
    maxWidth: Math.max(280, Math.min(720, Number(state.maxWidth) || DEFAULT_SIGNATURE_STATE.maxWidth)),
    borderRadius: Math.max(0, Math.min(32, Number.isFinite(Number(state.borderRadius)) ? Number(state.borderRadius) : DEFAULT_SIGNATURE_STATE.borderRadius)),
    bgColor: safeHex(state.bgColor, DEFAULT_SIGNATURE_STATE.bgColor),
    bgGradientEnd: safeHex(state.bgGradientEnd, DEFAULT_SIGNATURE_STATE.bgGradientEnd),
    accentColor: safeHex(state.accentColor, DEFAULT_SIGNATURE_STATE.accentColor),
    textColorPrimary: safeHex(state.textColorPrimary, DEFAULT_SIGNATURE_STATE.textColorPrimary),
    textColorSecondary: safeHex(state.textColorSecondary, DEFAULT_SIGNATURE_STATE.textColorSecondary),
    textColorMuted: safeHex(state.textColorMuted, DEFAULT_SIGNATURE_STATE.textColorMuted),
    bgType: ['solid', 'gradient', 'ambient', 'mesh', 'dots', 'grid', 'lines'].includes(state.bgType) ? state.bgType : 'solid',
    bgGradientAngle: Number.isFinite(Number(state.bgGradientAngle)) ? Math.max(0, Math.min(360, Math.round(Number(state.bgGradientAngle)))) : 135,
    widthMode: state.widthMode === 'fixed' ? 'fixed' : 'responsive',
    fontFamily: ['sans', 'serif', 'mono', 'grotesk'].includes(state.fontFamily) ? state.fontFamily : 'sans',
    nameFontSize: Math.max(14, Math.min(26, Number(state.nameFontSize) || 19)),
    titleStyle: ['regular', 'uppercase', 'italic'].includes(state.titleStyle) ? state.titleStyle : 'regular',
    buttonShape: ['rounded', 'pill', 'sharp'].includes(state.buttonShape) ? state.buttonShape : 'rounded'
  };
  const layout = safeState.layout || 'landscape-v2';

  switch (layout) {
    case 'compact-card':
      return renderCompactCard(safeState);
    case 'minimal-row':
      return renderMinimalRow(safeState);
    case 'landscape-v2':
    default:
      return renderLandscapeV2(safeState);
  }
}
