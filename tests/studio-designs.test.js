import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SIGNATURE_STATE, renderSignatureHTML } from '../js/studio-templates.js';
import { DESIGN_FAMILIES, DESIGN_FORMATS, renderAllFormats, renderDesignArtSVG } from '../js/studio-designs.js';
import { renderMultiFormatPreview, buildAllFormatsHTMLSheet, loadPresetByCardId } from '../js/studio.js';

const NEW_FAMILIES = DESIGN_FAMILIES.filter(f => f.id !== 'classic').map(f => f.id);
const FORMATS = DESIGN_FORMATS.map(f => f.id);
const render = (design, format, extra = {}) =>
  renderSignatureHTML({ ...DEFAULT_SIGNATURE_STATE, design, format, ...extra });

test('design registry exposes classic plus 8 art-directed families and 3 formats', () => {
  assert.deepEqual(DESIGN_FAMILIES.map(f => f.id), [
    'classic',
    'lime-panel',
    'ocean-split',
    'midnight-corner',
    'teal-ring',
    'sky-diagonal',
    'slate-hex',
    'sunset-gradient',
    'violet-pill'
  ]);
  assert.deepEqual(FORMATS, ['landscape', 'portrait', 'compact']);
});

test('every family renders email-safe table markup in every format (24 combinations)', () => {
  for (const design of NEW_FAMILIES) {
    for (const format of FORMATS) {
      const html = render(design, format);
      const label = `${design}/${format}`;
      assert.match(html, /<table/, label);
      assert.match(html, /bgcolor="#/i, `${label} needs bgcolor fallbacks`);
      assert.ok(!/<svg/i.test(html), `${label} must not use inline svg`);
      assert.ok(!/clip-path/i.test(html), `${label} must not use clip-path`);
      assert.ok(html.includes(DEFAULT_SIGNATURE_STATE.fullName), `${label} shows the name`);
    }
  }
});

test('all 8 families x 3 formats produce 24 visibly distinct HTML outputs', () => {
  const seen = new Set();
  for (const design of NEW_FAMILIES) {
    for (const format of FORMATS) seen.add(render(design, format));
  }
  assert.equal(seen.size, NEW_FAMILIES.length * FORMATS.length);
});

test('theme accent color flows into every family', () => {
  for (const design of NEW_FAMILIES) {
    const html = render(design, 'landscape', { accentColor: '#ff00aa' });
    assert.match(html, /#ff00aa/i, design);
  }
});

test('classic design keeps existing layout output unchanged', () => {
  const base = renderSignatureHTML({ ...DEFAULT_SIGNATURE_STATE });
  assert.equal(render('classic', 'landscape'), base);
});

test('classic maps portrait and compact formats onto existing layouts', () => {
  const portrait = render('classic', 'portrait');
  const compact = render('classic', 'compact');
  assert.equal(portrait, renderSignatureHTML({ ...DEFAULT_SIGNATURE_STATE, layout: 'compact-card' }));
  assert.equal(compact, renderSignatureHTML({ ...DEFAULT_SIGNATURE_STATE, layout: 'minimal-row' }));
});

test('unknown design or format falls back safely', () => {
  assert.match(render('nope', 'landscape'), /<table/);
  assert.match(render('lime-panel', 'weird'), /<table/);
});

test('logo size slider scales the photo inside designs', () => {
  const small = render('teal-ring', 'landscape', { logoSize: 40, logoUrl: 'https://example.com/a.png' });
  const large = render('teal-ring', 'landscape', { logoSize: 120, logoUrl: 'https://example.com/a.png' });
  const widthOf = html => Number(html.match(/<img[^>]*src="https:\/\/example\.com\/a\.png"[^>]*width="(\d+)"/)[1]);
  assert.ok(widthOf(large) > widthOf(small));
});

test('missing photo falls back to an initials badge instead of a broken image', () => {
  const html = render('lime-panel', 'landscape', { logoUrl: '', fullName: 'Ada Lovelace' });
  assert.ok(!/<img[^>]*alt="Logo"/.test(html));
  assert.match(html, />AL</);
});

test('text is escaped and unsafe urls are stripped inside designs', () => {
  const html = render('ocean-split', 'landscape', {
    fullName: '<script>alert(1)</script>',
    logoUrl: 'javascript:alert(1)'
  });
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('javascript:'));
});

test('text colors stay readable on every family for light and dark themes', () => {
  for (const bgColor of ['#0b1020', '#ffffff']) {
    for (const design of NEW_FAMILIES) {
      const html = render(design, 'landscape', { bgColor, textColorPrimary: bgColor });
      // Primary text must never inherit the (unreadable) theme value on its own panel.
      assert.ok(!new RegExp(`color:\\s*${bgColor};[^"]*">\\s*${DEFAULT_SIGNATURE_STATE.fullName}`, 'i').test(html), `${design} on ${bgColor}`);
    }
  }
});

test('renderAllFormats returns landscape, portrait and compact variants', () => {
  const all = renderAllFormats({ ...DEFAULT_SIGNATURE_STATE, design: 'midnight-corner' });
  assert.deepEqual(Object.keys(all), ['landscape', 'portrait', 'compact']);
  assert.notEqual(all.landscape, all.portrait);
  assert.notEqual(all.portrait, all.compact);
});

test('renderDesignArtSVG generates valid standalone SVG with theme colors and format geometry', () => {
  for (const design of NEW_FAMILIES) {
    for (const format of FORMATS) {
      const svg = renderDesignArtSVG({
        ...DEFAULT_SIGNATURE_STATE,
        design,
        format,
        accentColor: '#12ab34'
      });
      assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
      assert.match(svg, /#12ab34/i);
      assert.ok(svg.includes(DEFAULT_SIGNATURE_STATE.fullName));
    }
  }
});

test('renderMultiFormatPreview and buildAllFormatsHTMLSheet generate all 3 formats simultaneously', () => {
  const state = { ...DEFAULT_SIGNATURE_STATE, design: 'violet-pill', format: 'all' };
  const previewHtml = renderMultiFormatPreview(state);
  assert.ok(previewHtml.includes('data-format-block="landscape"'));
  assert.ok(previewHtml.includes('data-format-block="portrait"'));
  assert.ok(previewHtml.includes('data-format-block="compact"'));

  const sheetHtml = buildAllFormatsHTMLSheet(state);
  assert.match(sheetHtml, /<!DOCTYPE html>/i);
  assert.ok(sheetHtml.includes('1. Landscape'));
  assert.ok(sheetHtml.includes('2. Portrait'));
  assert.ok(sheetHtml.includes('3. Compact'));
});

test('loadPresetByCardId supports all 8 art-directed design family gallery cards (6..13)', () => {
  for (let cardId = 6; cardId <= 13; cardId++) {
    const presetState = loadPresetByCardId(cardId, DEFAULT_SIGNATURE_STATE);
    assert.notEqual(presetState.design, 'classic');
    assert.ok(NEW_FAMILIES.includes(presetState.design));
  }
});
