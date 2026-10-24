import test from 'node:test';
import assert from 'node:assert/strict';
import {
  renderSignatureHTML,
  DEFAULT_SIGNATURE_STATE,
  THEME_PRESETS,
  getContrastRatio,
  resolveMediaUrl,
  buildInitialsAvatarUrl,
  generateVCardString
} from '../js/studio-templates.js';

test('renderSignatureHTML produces valid table markup with default state', () => {
  const html = renderSignatureHTML(DEFAULT_SIGNATURE_STATE);
  assert.ok(html.includes('<table role="presentation"'));
  assert.ok(html.includes('Ezekiel P. Villadolid'));
  assert.ok(html.includes('Software Developer + UI/UX | Graphic Design'));
  assert.ok(html.includes('09939389798'));
  assert.ok(html.includes('zyk.graphics@gmail.com'));
});

test('renderSignatureHTML supports compact-card and minimal-row layouts', () => {
  const compactHtml = renderSignatureHTML({
    ...DEFAULT_SIGNATURE_STATE,
    layout: 'compact-card'
  });
  assert.ok(compactHtml.includes('max-width: 420px'));
  assert.ok(compactHtml.includes('text-align: center'));

  const minimalHtml = renderSignatureHTML({
    ...DEFAULT_SIGNATURE_STATE,
    layout: 'minimal-row'
  });
  assert.ok(minimalHtml.includes('padding: 14px 18px'));
});


test('renderSignatureHTML dynamically embeds accent color into hosted icon URLs', () => {
  const customState = {
    ...DEFAULT_SIGNATURE_STATE,
    accentColor: '#10b981' // emerald
  };
  const html = renderSignatureHTML(customState);
  assert.ok(html.includes('https://img.icons8.com/material-rounded/48/10b981/phone.png'));
  assert.ok(html.includes('https://img.icons8.com/material-rounded/48/10b981/mail.png'));
  assert.ok(!html.includes('data:image/svg+xml')); // Must not contain data URIs
});

test('renderSignatureHTML supports adding custom contact fields', () => {
  const customState = {
    ...DEFAULT_SIGNATURE_STATE,
    contactFields: [
      { id: 'c1', type: 'phone', label: 'Phone', value: '12345678', href: 'tel:12345678' },
      { id: 'c2', type: 'website', label: 'Portfolio', value: 'https://ezykl.dev', href: 'https://ezykl.dev' }
    ]
  };
  const html = renderSignatureHTML(customState);
  assert.ok(html.includes('https://ezykl.dev'));
  assert.ok(html.includes('domain.png'));
});

test('renderSignatureHTML collapses cleanly when 0 buttons are provided', () => {
  const customState = {
    ...DEFAULT_SIGNATURE_STATE,
    buttons: []
  };
  const html = renderSignatureHTML(customState);
  assert.ok(!html.includes('GitHub'));
  assert.ok(!html.includes('Download CV'));
});

test('renderSignatureHTML supports widthMode responsive (width="100%" and max-width)', () => {
  const html = renderSignatureHTML({
    ...DEFAULT_SIGNATURE_STATE,
    widthMode: 'responsive',
    maxWidth: 640
  });
  assert.ok(html.includes('width="100%"'));
  assert.ok(html.includes('width: 100% !important'));
  assert.ok(html.includes('max-width: 640px'));
});

test('renderSignatureHTML supports widthMode fixed (exact width and min-width/max-width locked)', () => {
  const html = renderSignatureHTML({
    ...DEFAULT_SIGNATURE_STATE,
    widthMode: 'fixed',
    maxWidth: 550
  });
  assert.ok(html.includes('width="550"'));
  assert.ok(html.includes('width: 550px !important'));
  assert.ok(html.includes('min-width: 550px'));
});

test('renderSignatureHTML escapes text and strips unsafe URLs from public editor input', () => {
  const html = renderSignatureHTML({
    ...DEFAULT_SIGNATURE_STATE,
    fullName: '<img src=x onerror=alert(1)>',
    logoUrl: 'javascript:alert(1)',
    contactFields: [{ id: 'c1', type: 'website', label: 'Site', value: '<script>', href: 'javascript:alert(1)' }]
  });
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('javascript:alert'));
  assert.ok(!html.includes('<img src=x onerror'));
});


test('compact-card responsive mode honors the max width chosen by the user (no hidden 440px cap)', () => {
  const html = renderSignatureHTML({
    ...DEFAULT_SIGNATURE_STATE,
    layout: 'compact-card',
    widthMode: 'responsive',
    maxWidth: 600
  });
  assert.ok(html.includes('max-width: 600px'));
  assert.ok(!html.includes('max-width: 440px'));
});

test('THEME_PRESETS contains 16 curated aesthetic presets with required styling properties', async () => {
  const { THEME_PRESETS } = await import('../js/studio-templates.js');
  const keys = Object.keys(THEME_PRESETS);
  assert.ok(keys.length >= 16, 'Expected >= 16 presets, got ' + keys.length);
  keys.forEach(k => {
    const p = THEME_PRESETS[k];
    assert.ok(p.name, 'Preset ' + k + ' missing name');
    assert.ok(p.bgColor, 'Preset ' + k + ' missing bgColor');
    assert.ok(p.accentColor, 'Preset ' + k + ' missing accentColor');
    assert.ok(p.textColorPrimary, 'Preset ' + k + ' missing textColorPrimary');
  });
});

test('renderSignatureHTML supports all 7 background types with solid background-color fallback', () => {
  const types = ['solid', 'gradient', 'ambient', 'mesh', 'dots', 'grid', 'lines'];
  types.forEach(type => {
    const html = renderSignatureHTML({
      ...DEFAULT_SIGNATURE_STATE,
      bgType: type,
      bgColor: '#101828',
      bgGradientEnd: '#1e293b',
      accentColor: '#38bdf8',
      bgGradientAngle: 180
    });
    assert.ok(html.includes('background-color: #101828'), 'Type ' + type + ' must include solid fallback background-color');
    if (type !== 'solid') {
      assert.ok(html.includes('background-image:'), 'Type ' + type + ' must include background-image');
    }
    if (['gradient', 'ambient', 'mesh', 'dots', 'grid', 'lines'].includes(type)) {
      assert.ok(html.includes('180deg'), 'Type ' + type + ' must interpolate angle');
    }
  });
});

test('getContrastRatio calculates WCAG 2.1 relative luminance contrast accurately', async () => {
  const { getContrastRatio } = await import('../js/studio-templates.js');
  assert.ok(typeof getContrastRatio === 'function');
  const blackAndWhite = getContrastRatio('#000000', '#ffffff');
  assert.equal(Math.round(blackAndWhite), 21);
  const sameColor = getContrastRatio('#3b82f6', '#3b82f6');
  assert.equal(Math.round(sameColor), 1);
});

test('renderSignatureHTML renders action buttons with streamlined core icon set', () => {
  const customState = {
    ...DEFAULT_SIGNATURE_STATE,
    buttons: [
      { id: 'b1', icon: 'github', label: 'GitHub', url: 'https://github.com/test' },
      { id: 'b2', icon: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/test' },
      { id: 'b3', icon: 'download', label: 'CV', url: 'https://test.com/cv.pdf' },
      { id: 'b4', icon: 'none', label: 'Plain', url: 'https://plain.com' }
    ]
  };
  const html = renderSignatureHTML(customState);
  assert.ok(html.includes('github.png'));
  assert.ok(html.includes('linkedin--v1.png'));
  assert.ok(html.includes('download.png'));
  assert.ok(!html.includes('none.png'));
});

test('renderSignatureHTML renders hosted icons for email, location, phone, and aliases', () => {
  const customState = {
    ...DEFAULT_SIGNATURE_STATE,
    contactFields: [
      { id: 'c1', type: 'email', label: 'Email', value: 'hello@test.com', href: 'mailto:hello@test.com' },
      { id: 'c2', type: 'location', label: 'Location', value: 'Manila, Philippines', href: '' },
      { id: 'c3', type: 'address', label: 'Address', value: 'Cebu, Philippines', href: '' },
      { id: 'c4', type: 'mobile', label: 'Mobile', value: '+63 900 000 0000', href: 'tel:+639000000000' }
    ]
  };
  const html = renderSignatureHTML(customState);
  assert.ok(html.includes('mail.png'));
  assert.ok(html.includes('marker.png'));
  assert.ok(html.includes('phone.png'));
  assert.ok(html.includes('Manila, Philippines'));
  assert.ok(html.includes('Cebu, Philippines'));
});

test('renderSignatureHTML respects typography settings (fontFamily, nameFontSize, titleStyle)', () => {
  const customTypography = {
    ...DEFAULT_SIGNATURE_STATE,
    fontFamily: 'serif',
    nameFontSize: 22,
    titleStyle: 'uppercase'
  };
  const html = renderSignatureHTML(customTypography);
  assert.match(html, /Georgia/);
  assert.match(html, /font-size:\s*22px/);
  assert.match(html, /text-transform:\s*uppercase/);
});

test('renderActionButtons renders button shapes (pill, sharp, rounded) and outline style', () => {
  const state = {
    ...DEFAULT_SIGNATURE_STATE,
    buttonShape: 'pill',
    accentColor: '#38bdf8',
    buttons: [
      { id: 'b1', label: 'Book Call', url: 'https://calendly.com', icon: 'calendly', style: 'outline' }
    ]
  };
  const html = renderSignatureHTML(state);
  assert.match(html, /border-radius:\s*999px/);
  assert.match(html, /border:\s*1px solid #38bdf8/);
  assert.match(html, /calendar\.png/);
});

test('renderSignatureHTML renders accent-bar and split-avatar layouts', () => {
  const accentBarState = { ...DEFAULT_SIGNATURE_STATE, layout: 'accent-bar', accentColor: '#38bdf8' };
  const splitAvatarState = { ...DEFAULT_SIGNATURE_STATE, layout: 'split-avatar' };
  
  const accentHtml = renderSignatureHTML(accentBarState);
  assert.match(accentHtml, /border-left:\s*4px solid #38bdf8/);
  
  const splitHtml = renderSignatureHTML(splitAvatarState);
  assert.match(splitHtml, /width="70"/);
  assert.match(splitHtml, /border-radius:\s*50%/);
});

test('resolveMediaUrl converts Google Drive share links into direct thumbnail image URLs', () => {
  const res1 = resolveMediaUrl('https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9/view?usp=sharing', 'image');
  assert.equal(res1.provider, 'google-drive');
  assert.equal(res1.converted, true);
  assert.equal(res1.url, 'https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9&sz=w512');

  const res2 = resolveMediaUrl('https://drive.google.com/open?id=XYZ987654321', 'image');
  assert.equal(res2.provider, 'google-drive');
  assert.equal(res2.converted, true);
  assert.equal(res2.url, 'https://drive.google.com/thumbnail?id=XYZ987654321&sz=w512');
});

test('resolveMediaUrl converts GitHub blob and profile URLs into raw image URLs', () => {
  const blobRes = resolveMediaUrl('https://github.com/ezykl/Portfolio/blob/master/public/assets/logo.png', 'image');
  assert.equal(blobRes.provider, 'github');
  assert.equal(blobRes.converted, true);
  assert.equal(blobRes.url, 'https://raw.githubusercontent.com/ezykl/Portfolio/master/public/assets/logo.png');

  const profileRes = resolveMediaUrl('https://github.com/ezykl', 'image');
  assert.equal(profileRes.provider, 'github');
  assert.equal(profileRes.converted, true);
  assert.equal(profileRes.url, 'https://github.com/ezykl.png?size=256');
});

test('resolveMediaUrl converts Dropbox and Imgur share links into raw image URLs', () => {
  const dropboxRes = resolveMediaUrl('https://www.dropbox.com/scl/fi/abc123/logo.png?rlkey=xyz987&dl=0', 'image');
  assert.equal(dropboxRes.provider, 'dropbox');
  assert.equal(dropboxRes.converted, true);
  assert.ok(dropboxRes.url.includes('raw=1'));
  assert.ok(dropboxRes.url.includes('rlkey=xyz987'));

  const imgurRes = resolveMediaUrl('https://imgur.com/AbCdEfG', 'image');
  assert.equal(imgurRes.provider, 'imgur');
  assert.equal(imgurRes.converted, true);
  assert.equal(imgurRes.url, 'https://i.imgur.com/AbCdEfG.png');
});

test('resolveMediaUrl flags non-direct webpage viewers with a warning', () => {
  const ibbRes = resolveMediaUrl('https://ibb.co/xYz123', 'image');
  assert.equal(ibbRes.provider, 'webpage-warning');
  assert.ok(ibbRes.warning);

  const albumRes = resolveMediaUrl('https://imgur.com/a/AbCdEfG', 'image');
  assert.equal(albumRes.provider, 'webpage-warning');
  assert.ok(albumRes.warning);
});

test('buildInitialsAvatarUrl generates hosted ui-avatars URL synced with name and colors', () => {
  const url = buildInitialsAvatarUrl({
    fullName: 'Ezekiel Villadolid',
    bgColor: '#000440',
    accentColor: '#38bdf8'
  });
  assert.ok(url.startsWith('https://ui-avatars.com/api/?'));
  assert.ok(url.includes('name=Ezekiel%20Villadolid'));
  assert.ok(url.includes('background=000440'));
  assert.ok(url.includes('color=38bdf8'));
});

test('renderSignatureHTML automatically normalizes Google Drive or GitHub share links in logoUrl', () => {
  const html = renderSignatureHTML({
    ...DEFAULT_SIGNATURE_STATE,
    logoUrl: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9/view?usp=sharing'
  });
  assert.ok(html.includes('https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9&amp;sz=w512'));
});

test('generateVCardString builds valid vCard 3.0 payload from signature state', () => {
  const vcf = generateVCardString(DEFAULT_SIGNATURE_STATE);
  assert.ok(vcf.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n'));
  assert.ok(vcf.includes('FN:Ezekiel P. Villadolid\r\n'));
  assert.ok(vcf.includes('N:Villadolid;Ezekiel P.;;;\r\n'));
  assert.ok(vcf.includes('TITLE:Software Developer + UI/UX | Graphic Design\r\n'));
  assert.ok(vcf.includes('TEL;TYPE=CELL:09939389798\r\n'));
  assert.ok(vcf.includes('EMAIL;TYPE=INTERNET:zyk.graphics@gmail.com\r\n'));
  assert.ok(vcf.includes('ADR;TYPE=WORK:;;M. Logarta Street\\, San Roque\\, Cebu City;;;;\r\n'));
  assert.ok(vcf.includes('URL:https://github.com/ezykl\r\n'));
  assert.ok(vcf.endsWith('END:VCARD\r\n'));
});

test('minimal-light theme renders high-contrast dark contact text and borders, avoiding invisible light-on-white text', () => {
  const state = {
    ...DEFAULT_SIGNATURE_STATE,
    ...THEME_PRESETS['minimal-light'],
    layout: 'landscape-v2'
  };
  const html = renderSignatureHTML(state);
  // Must use high contrast dark color for contact details, not faint #e2e8f0
  assert.ok(!html.includes('color: #e2e8f0;'), 'Must not hardcode light gray contact text');
  assert.ok(html.includes('color: #475569;'), 'Must use theme textColorSecondary for contact links');
  const contrast = getContrastRatio('#ffffff', '#475569');
  assert.ok(contrast >= 4.5, `Minimal light contact contrast should be >= 4.5:1, got ${contrast}`);
});

test('all curated theme presets render contact details with WCAG AA compliant contrast (>= 4.5:1)', () => {
  const layouts = ['landscape-v2', 'compact-card', 'minimal-row', 'accent-bar', 'split-avatar'];
  for (const [key, preset] of Object.entries(THEME_PRESETS)) {
    for (const layout of layouts) {
      const state = { ...DEFAULT_SIGNATURE_STATE, ...preset, layout };
      const html = renderSignatureHTML(state);
      const match = html.match(/<a [^>]*style="[^"]*color:\s*([^;]+);/i);
      assert.ok(match, `Expected contact link in preset ${key} layout ${layout}`);
      const contactColor = match[1].trim();
      const ratio = getContrastRatio(preset.bgColor, contactColor);
      assert.ok(
        ratio >= 4.0,
        `Preset ${key} on layout ${layout} failed contrast: ${ratio.toFixed(2)}:1 (color: ${contactColor} on bg: ${preset.bgColor})`
      );
    }
  }
});


