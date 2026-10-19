import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSignatureHTML, DEFAULT_SIGNATURE_STATE } from '../js/studio-templates.js';

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
