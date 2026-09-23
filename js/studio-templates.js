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
    accentColor: '#0284c7',
    textColorPrimary: '#0f172a',
    textColorSecondary: '#475569',
    textColorMuted: '#64748b',
    buttonBg: '#f8fafc',
    buttonBorder: '#cbd5e1'
  }
};

export const CONTACT_ICON_MAP = {
  phone: 'phone.png',
  email: 'mail.png',
  location: 'marker.png',
  website: 'domain.png',
  calendar: 'calendar.png',
  custom: 'star.png',
  portfolio: 'domain.png'
};

export const BUTTON_ICON_MAP = {
  github: 'github.png',
  linkedin: 'linkedin--v1.png',
  download: 'download.png',
  globe: 'domain.png',
  website: 'domain.png',
  calendar: 'calendar.png',
  twitter: 'twitter.png'
};

export const DEFAULT_SIGNATURE_STATE = {
  layout: 'landscape-v2', // 'landscape-v2' | 'compact-card' | 'minimal-row'
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
  bgType: 'solid', // 'solid' | 'gradient' | 'ambient'
  bgGradientEnd: '#00086b',
  accentColor: '#38bdf8',
  textColorPrimary: '#ffffff',
  textColorSecondary: '#93c5fd',
  textColorMuted: '#cbd5e1',
  buttonBg: '#121829',
  buttonBorder: 'rgba(255, 255, 255, 0.16)'
};

/**
 * Strips '#' from hex code for URL interpolation.
 */
function cleanHex(color) {
  if (!color) return '38bdf8';
  return color.replace('#', '').trim();
}

/**
 * Computes background inline CSS safely without SVG data URIs.
 */
function getBackgroundStyle(state) {
  const bg = state.bgColor || '#000440';
  const end = state.bgGradientEnd || '#00086b';

  if (state.bgType === 'gradient') {
    return `background-color: ${bg}; background-image: linear-gradient(135deg, ${bg} 0%, ${end} 100%);`;
  }
  if (state.bgType === 'ambient') {
    return `background-color: ${bg}; background-image: radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 60%), linear-gradient(180deg, ${bg} 0%, ${end} 100%);`;
  }
  return `background-color: ${bg};`;
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

    const textContent = field.href ? `
      <a href="${field.href}" style="font-size: 11.5px; color: #e2e8f0; text-decoration: none; font-weight: 500; word-break: break-all;">
        ${field.value}
      </a>
    ` : `
      <span style="font-size: 11.5px; color: #cbd5e1; font-weight: 400; line-height: 1.3;">
        ${field.value}
      </span>
    `;

    return `
      <tr>
        <td style="width: 20px; padding: 2.5px 0; vertical-align: middle;">
          <img src="${iconUrl}" width="13" height="13" alt="${field.label || field.type}" style="display: block; border: 0; outline: none; width: 13px; height: 13px;" />
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
      const accent = state.accentColor || '#38bdf8';
      bgStyle = `background-color: ${accent}; background-image: linear-gradient(180deg, ${accent} 0%, rgba(0, 0, 0, 0.35) 100%); border: 1px solid rgba(255, 255, 255, 0.25); color: #ffffff;`;
    }

    const iconFile = BUTTON_ICON_MAP[btn.icon] || (btn.icon ? `${btn.icon}.png` : null);
    const iconTag = (iconFile && btn.icon !== 'none') ? `
      <img src="https://img.icons8.com/material-rounded/48/ffffff/${iconFile}" alt="${btn.label}" width="12" height="12" style="display: inline-block; vertical-align: -2px; margin-right: 4px; width: 12px; height: 12px; border: 0;" />
    ` : '';

    return `
      <td style="${paddingStyle} width: ${colWidth}; vertical-align: middle;">
        <a href="${btn.url || '#'}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; ${bgStyle} font-size: 10.5px; font-weight: 600; text-decoration: none; padding: 7px 6px; border-radius: 7px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25); line-height: 14px; white-space: nowrap;">
          ${iconTag.trim()}${btn.label}
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
 * Renders Landscape V2 Layout
 */
function renderLandscapeV2(state) {
  const bgStyle = getBackgroundStyle(state);
  const maxWidth = state.maxWidth || 680;
  const radius = state.borderRadius !== undefined ? state.borderRadius : 16;
  const contactRows = renderContactRows(state.contactFields, state.accentColor);
  const buttonsMarkup = renderActionButtons(state.buttons, state);

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="auto" style="width: auto !important; max-width: ${maxWidth}px; min-width: 280px; margin: 0; border-collapse: separate; ${bgStyle} border: 1px solid rgba(255, 255, 255, 0.14); border-radius: ${radius}px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow: hidden;">
  <tr>
    <td style="padding: 16px 22px 16px 22px; border-radius: ${radius}px;">
      <!-- Top Section: Name/Title on Left, Logo on Right -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <!-- Name & Title -->
          <td style="vertical-align: middle;">
            <h1 style="margin: 0 0 2px 0; font-size: 19px; font-weight: 700; color: ${state.textColorPrimary || '#ffffff'}; letter-spacing: -0.2px; line-height: 1.2;">
              ${state.fullName || ''}
            </h1>
            <span style="display: inline-block; font-size: 12px; color: ${state.textColorSecondary || '#93c5fd'}; font-weight: 600; letter-spacing: 0.2px;">
              ${state.jobTitle || ''}
            </span>
          </td>
          ${state.logoUrl ? `
          <!-- Logo (Top Right) -->
          <td align="right" style="vertical-align: middle; padding-left: 14px; width: 70px;">
            <img src="${state.logoUrl}" alt="Logo" width="70" height="46" style="display: block; border: 0; outline: none; max-width: 70px; width: 100%; height: auto;" />
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
  const maxWidth = (state.maxWidth && state.maxWidth !== 680) ? Math.min(state.maxWidth, 440) : 420;
  const radius = state.borderRadius !== undefined ? state.borderRadius : 16;
  const contactRows = renderContactRows(state.contactFields, state.accentColor);
  const buttonsMarkup = renderActionButtons(state.buttons, state);

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="auto" style="width: auto !important; max-width: ${maxWidth}px; min-width: 260px; margin: 0; border-collapse: separate; ${bgStyle} border: 1px solid rgba(255, 255, 255, 0.14); border-radius: ${radius}px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow: hidden;">
  <tr>
    <td style="padding: 20px; border-radius: ${radius}px; text-align: center;">
      ${state.logoUrl ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom: 12px;">
            <img src="${state.logoUrl}" alt="Logo" width="60" height="40" style="display: block; margin: 0 auto; border: 0; outline: none; max-width: 60px; height: auto;" />
          </td>
        </tr>
      </table>
      ` : ''}

      <h1 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 700; color: ${state.textColorPrimary || '#ffffff'}; line-height: 1.2;">
        ${state.fullName || ''}
      </h1>
      <span style="display: inline-block; font-size: 12px; color: ${state.textColorSecondary || '#93c5fd'}; font-weight: 600; margin-bottom: 12px;">
        ${state.jobTitle || ''}
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
  const maxWidth = state.maxWidth || 680;
  const radius = state.borderRadius !== undefined ? state.borderRadius : 10;
  const contactRows = renderContactRows(state.contactFields, state.accentColor);
  const buttonsMarkup = renderActionButtons(state.buttons, state);

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="auto" style="width: auto !important; max-width: ${maxWidth}px; min-width: 280px; margin: 0; border-collapse: separate; ${bgStyle} border: 1px solid rgba(255, 255, 255, 0.14); border-radius: ${radius}px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; overflow: hidden;">
  <tr>
    <td style="padding: 14px 18px; border-radius: ${radius}px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          ${state.logoUrl ? `
          <td style="vertical-align: middle; padding-right: 14px; width: 50px;">
            <img src="${state.logoUrl}" alt="Logo" width="50" height="34" style="display: block; border: 0; outline: none; max-width: 50px; height: auto;" />
          </td>
          ` : ''}
          <td style="vertical-align: middle;">
            <div style="font-size: 17px; font-weight: 700; color: ${state.textColorPrimary || '#ffffff'}; line-height: 1.2;">
              ${state.fullName || ''}
            </div>
            <div style="font-size: 11.5px; color: ${state.textColorSecondary || '#93c5fd'}; font-weight: 600; margin-top: 2px;">
              ${state.jobTitle || ''}
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
  const layout = state.layout || 'landscape-v2';

  switch (layout) {
    case 'compact-card':
      return renderCompactCard(state);
    case 'minimal-row':
      return renderMinimalRow(state);
    case 'landscape-v2':
    default:
      return renderLandscapeV2(state);
  }
}
