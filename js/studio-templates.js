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
  buttonShape: 'rounded',
  editorMode: 'guided',
  wizardStep: 1
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
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(raw)) {
    return escapeHTML(raw);
  }
  const resolved = resolveMediaUrl(raw, 'image').url || raw;
  return /^(https?:|mailto:|tel:)/i.test(resolved) ? escapeHTML(resolved) : fallback;
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
 * Multi-source URL detector and raw image / link normalizer.
 * Converts share links from Google Drive, GitHub, Dropbox, and Imgur into raw displayable URLs.
 */
export function resolveMediaUrl(rawUrl, mode = 'image') {
  const trimmed = String(rawUrl ?? '').trim();
  if (!trimmed) {
    return { url: '', provider: 'empty', converted: false, warning: null, label: '' };
  }

  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)) {
    return {
      url: trimmed,
      provider: 'data-url',
      converted: false,
      warning: 'Local file works for 2x PNG downloads. For Gmail/Outlook HTML copy, a cloud link or Initials/GitHub badge is recommended.',
      label: 'Local image (PNG export ready)'
    };
  }

  if (/^(mailto:|tel:)/i.test(trimmed)) {
    return { url: trimmed, provider: 'direct', converted: false, warning: null, label: 'Direct contact link' };
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return { url: trimmed, provider: 'invalid', converted: false, warning: 'Enter a full https:// URL.', label: 'Invalid URL' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { url: trimmed, provider: 'invalid', converted: false, warning: 'Enter a valid https:// URL.', label: 'Invalid URL' };
  }

  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname;

  // 1. Google Drive
  if (host === 'drive.google.com' || host === 'docs.google.com') {
    const fileMatch = path.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const queryId = parsed.searchParams.get('id');
    const fileId = fileMatch ? fileMatch[1] : queryId;
    if (fileId) {
      if (mode === 'image') {
        const directUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w512`;
        return {
          url: directUrl,
          provider: 'google-drive',
          converted: trimmed !== directUrl,
          warning: null,
          label: 'Google Drive direct image'
        };
      }
      const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
      return {
        url: viewUrl,
        provider: 'google-drive',
        converted: trimmed !== viewUrl,
        warning: null,
        label: 'Google Drive document link'
      };
    }
  }

  // 2. GitHub (blob -> raw.githubusercontent.com, or profile -> .png)
  if (host === 'raw.githubusercontent.com') {
    return { url: trimmed, provider: 'github', converted: false, warning: null, label: 'GitHub raw asset' };
  }
  if (host === 'github.com' || host === 'www.github.com') {
    const blobMatch = path.match(/^\/([^/]+)\/([^/]+)\/blob\/(.+)$/);
    if (blobMatch) {
      const rawGhUrl = `https://raw.githubusercontent.com/${blobMatch[1]}/${blobMatch[2]}/${blobMatch[3]}`;
      return {
        url: rawGhUrl,
        provider: 'github',
        converted: true,
        warning: null,
        label: 'Converted GitHub file to raw URL'
      };
    }
    const profileMatch = path.match(/^\/([a-zA-Z0-9-]+)\/?$/);
    const reserved = new Set(['features', 'pricing', 'orgs', 'settings', 'login', 'explore', 'marketplace', 'topics', 'collections', 'events', 'sponsors', 'about']);
    if (mode === 'image' && profileMatch && !reserved.has(profileMatch[1].toLowerCase())) {
      const avatarUrl = `https://github.com/${profileMatch[1]}.png?size=256`;
      return {
        url: avatarUrl,
        provider: 'github',
        converted: true,
        warning: null,
        label: `GitHub avatar (@${profileMatch[1]})`
      };
    }
    if (mode === 'image' && /^\/[a-zA-Z0-9-]+\.png$/i.test(path)) {
      return { url: trimmed, provider: 'github', converted: false, warning: null, label: 'GitHub avatar' };
    }
  }

  // 3. Dropbox (?dl=0 -> ?raw=1 while preserving rlkey)
  if (host === 'dropbox.com' || host === 'www.dropbox.com') {
    if (mode === 'image') {
      const wasRaw = parsed.searchParams.get('raw') === '1';
      parsed.searchParams.delete('dl');
      parsed.searchParams.set('raw', '1');
      const nextUrl = parsed.toString();
      return {
        url: nextUrl,
        provider: 'dropbox',
        converted: !wasRaw,
        warning: null,
        label: 'Dropbox direct image'
      };
    }
  }
  if (host === 'dl.dropboxusercontent.com') {
    return { url: trimmed, provider: 'dropbox', converted: false, warning: null, label: 'Dropbox direct asset' };
  }

  // 4. Imgur (single page -> i.imgur.com/{id}.png; album -> warning)
  if (host === 'i.imgur.com') {
    return { url: trimmed, provider: 'imgur', converted: false, warning: null, label: 'Imgur direct image' };
  }
  if (host === 'imgur.com' || host === 'www.imgur.com') {
    if (/^\/(a|gallery|t)\//i.test(path)) {
      return {
        url: trimmed,
        provider: 'webpage-warning',
        converted: false,
        warning: 'This is an Imgur album/gallery link. Right-click the image on Imgur and select "Copy image address" (i.imgur.com/...).',
        label: 'Webpage link (not direct image)'
      };
    }
    const singleMatch = path.match(/^\/([a-zA-Z0-9]+)\/?$/);
    if (mode === 'image' && singleMatch) {
      const directImgur = `https://i.imgur.com/${singleMatch[1]}.png`;
      return {
        url: directImgur,
        provider: 'imgur',
        converted: true,
        warning: null,
        label: 'Converted Imgur link to direct image'
      };
    }
  }

  // 5. UI Avatars
  if (host === 'ui-avatars.com') {
    return { url: trimmed, provider: 'ui-avatars', converted: false, warning: null, label: 'Initials monogram badge' };
  }

  // 6. Known non-direct webpage viewers (ibb.co, postimg.cc, canva.com, 1drv.ms, etc.)
  const webpageViewers = new Set(['ibb.co', 'www.ibb.co', 'postimg.cc', 'www.postimg.cc', 'canva.com', 'www.canva.com', '1drv.ms', 'onedrive.live.com', 'pinterest.com', 'www.pinterest.com', 'pin.it', 'flickr.com', 'www.flickr.com']);
  if (mode === 'image' && webpageViewers.has(host)) {
    return {
      url: trimmed,
      provider: 'webpage-warning',
      converted: false,
      warning: `This ${host} link opens a webpage viewer instead of a raw image. Right-click the image on that page and choose "Copy image address".`,
      label: 'Webpage link (needs direct image URL)'
    };
  }

  return { url: trimmed, provider: 'direct', converted: false, warning: null, label: 'Direct URL' };
}

/**
 * Generates an email-safe hosted PNG monogram avatar URL synced with the user's name and theme palette.
 */
export function buildInitialsAvatarUrl(state = DEFAULT_SIGNATURE_STATE) {
  const rawName = String(state?.fullName || 'Your Name').trim() || 'Your Name';
  const bgHex = cleanHex(state?.bgColor || '#000440');
  const colorHex = cleanHex(state?.accentColor || '#38bdf8');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(rawName)}&background=${bgHex}&color=${colorHex}&size=128&bold=true&rounded=true&format=png`;
}

/**
 * Generates a standards-compliant vCard 3.0 (.vcf) string from the signature state.
 */
export function generateVCardString(state = DEFAULT_SIGNATURE_STATE) {
  const escapeVCard = val => String(val ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const fullName = String(state?.fullName || 'Your Name').trim() || 'Your Name';
  const parts = fullName.split(/\s+/);
  const lastName = parts.length > 1 ? parts.pop() : '';
  const firstName = parts.join(' ');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCard(fullName)}`,
    `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`
  ];

  if (state?.jobTitle && String(state.jobTitle).trim()) {
    lines.push(`TITLE:${escapeVCard(String(state.jobTitle).trim())}`);
  }

  const seenUrls = new Set();
  for (const field of (state?.contactFields || [])) {
    const val = String(field?.value || '').trim();
    const href = String(field?.href || '').trim();
    if (!val && !href) continue;

    if (field.type === 'phone' || field.type === 'mobile' || /^tel:/i.test(href)) {
      const tel = val || href.replace(/^tel:/i, '');
      if (tel) lines.push(`TEL;TYPE=CELL:${escapeVCard(tel)}`);
    } else if (field.type === 'email' || /^mailto:/i.test(href)) {
      const email = val || href.replace(/^mailto:/i, '');
      if (email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(email)}`);
    } else if (field.type === 'location' || field.type === 'address' || field.type === 'map') {
      if (val) lines.push(`ADR;TYPE=WORK:;;${escapeVCard(val)};;;;`);
    } else if (/^https?:\/\//i.test(href)) {
      if (!seenUrls.has(href)) {
        seenUrls.add(href);
        lines.push(`URL:${href}`);
      }
    }
  }

  for (const btn of (state?.buttons || [])) {
    const url = String(btn?.url || '').trim();
    if (/^https?:\/\//i.test(url) && !seenUrls.has(url)) {
      seenUrls.add(url);
      lines.push(`URL:${url}`);
    }
  }

  lines.push('END:VCARD');
  return `${lines.join('\r\n')}\r\n`;
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
export function getBackgroundStyle(state) {
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
      <a href="${href}" style="font-size: 11.5px; color: #e2e8f0; text-decoration: none; font-weight: 500; word-break: break-all; overflow-wrap: anywhere;">
        ${escapeHTML(field.value)}
      </a>
    ` : `
      <span style="font-size: 11.5px; color: #cbd5e1; font-weight: 400; line-height: 1.3; word-break: break-word; overflow-wrap: anywhere;">
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
 * Renders Executive Accent Bar Layout
 */
function renderAccentBar(state) {
  const bgStyle = getBackgroundStyle(state);
  const widthCfg = getTableWidthConfig(state, 680, 280);
  const radius = state.borderRadius !== undefined ? state.borderRadius : 12;
  const accent = safeHex(state.accentColor, '#38bdf8');
  const contactRows = renderContactRows(state.contactFields, state.accentColor);
  const buttonsMarkup = renderActionButtons(state.buttons, state);
  const nameSize = state.nameFontSize || 19;
  const titleStyleAttr = getTitleStyleAttr(state.titleStyle, state.textColorSecondary || '#93c5fd');

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${widthCfg.widthAttr}" style="${widthCfg.widthStyle} margin: 0; border-collapse: separate; ${bgStyle} border: 1px solid ${getBorderColor(state)}; border-radius: ${radius}px; font-family: ${getFontFamily(state.fontFamily)}; overflow: hidden;">
  <tr>
    <td style="padding: 16px 20px; border-radius: ${radius}px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <!-- Left 4px accent bar cell -->
          <td style="border-left: 4px solid ${accent}; padding-left: 14px; vertical-align: top;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align: middle;">
                  <div style="margin: 0 0 2px 0; font-size: ${nameSize}px; font-weight: 700; color: ${state.textColorPrimary || '#ffffff'}; line-height: 1.2;">
                    ${escapeHTML(state.fullName)}
                  </div>
                  <div style="font-size: 12px; font-weight: 600; ${titleStyleAttr}">
                    ${escapeHTML(state.jobTitle)}
                  </div>
                </td>
                ${safeUrl(state.logoUrl) ? `
                <td align="right" style="vertical-align: middle; padding-left: 12px; width: 60px;">
                  <img src="${safeUrl(state.logoUrl)}" alt="Logo" width="60" height="40" style="display: block; border: 0; outline: none; max-width: 60px; height: auto;" />
                </td>
                ` : ''}
              </tr>
            </table>

            ${contactRows ? `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 10px;">
              ${contactRows}
            </table>
            ` : ''}

            ${buttonsMarkup}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
}

/**
 * Renders Split Avatar Layout (Modern Round Avatar Bio)
 */
function renderSplitAvatar(state) {
  const bgStyle = getBackgroundStyle(state);
  const widthCfg = getTableWidthConfig(state, 680, 280);
  const radius = state.borderRadius !== undefined ? state.borderRadius : 16;
  const contactRows = renderContactRows(state.contactFields, state.accentColor);
  const buttonsMarkup = renderActionButtons(state.buttons, state);
  const nameSize = state.nameFontSize || 19;
  const titleStyleAttr = getTitleStyleAttr(state.titleStyle, state.textColorSecondary || '#93c5fd');
  const avatarUrl = safeUrl(state.logoUrl, 'https://raw.githubusercontent.com/ezykl/Portfolio/refs/heads/master/public/assets/logo.png');

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${widthCfg.widthAttr}" style="${widthCfg.widthStyle} margin: 0; border-collapse: separate; ${bgStyle} border: 1px solid ${getBorderColor(state)}; border-radius: ${radius}px; font-family: ${getFontFamily(state.fontFamily)}; overflow: hidden;">
  <tr>
    <td style="padding: 18px 20px; border-radius: ${radius}px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <!-- Left Column: Circular Avatar -->
          <td style="width: 70px; vertical-align: top; padding-right: 18px;" align="center">
            <img src="${avatarUrl}" alt="Avatar" width="70" height="70" style="display: block; width: 70px; height: 70px; border-radius: 50%; border: 0; outline: none; object-fit: cover;" />
          </td>
          <!-- Right Column: Details & Buttons -->
          <td style="vertical-align: top;">
            <div style="margin: 0 0 2px 0; font-size: ${nameSize}px; font-weight: 700; color: ${state.textColorPrimary || '#ffffff'}; line-height: 1.2;">
              ${escapeHTML(state.fullName)}
            </div>
            <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px; ${titleStyleAttr}">
              ${escapeHTML(state.jobTitle)}
            </div>

            ${contactRows ? `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 6px;">
              ${contactRows}
            </table>
            ` : ''}

            ${buttonsMarkup}
          </td>
        </tr>
      </table>
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
    case 'accent-bar':
      return renderAccentBar(safeState);
    case 'split-avatar':
      return renderSplitAvatar(safeState);
    case 'landscape-v2':
    default:
      return renderLandscapeV2(safeState);
  }
}
