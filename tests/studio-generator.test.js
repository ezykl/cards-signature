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
