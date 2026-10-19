import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createStudioStore,
  loadPresetByCardId,
  getContactSymbol,
  getContactPlaceholders,
  getButtonSymbol
} from '../js/studio.js';
import { DEFAULT_SIGNATURE_STATE, THEME_PRESETS } from '../js/studio-templates.js';

test('createStudioStore initializes with default signature state', () => {
  const store = createStudioStore();
  const state = store.getState();
  assert.equal(state.fullName, DEFAULT_SIGNATURE_STATE.fullName);
  assert.equal(state.layout, 'landscape-v2');
  assert.equal(state.contactFields.length, 3);
  assert.equal(state.buttons.length, 3);
});

test('store updates top-level attributes', () => {
  const store = createStudioStore();
  store.setField('fullName', 'Alex Chen');
  store.setField('maxWidth', 600);
  assert.equal(store.getState().fullName, 'Alex Chen');
  assert.equal(store.getState().maxWidth, 600);
});

test('store manages contact fields: add, update, remove', () => {
  const store = createStudioStore();
  
  // Add
  const newField = store.addContactField({
    type: 'website',
    label: 'Portfolio',
    value: 'https://alexchen.dev',
    href: 'https://alexchen.dev'
  });
  assert.ok(newField.id);
  assert.equal(store.getState().contactFields.length, 4);

  // Update
  store.updateContactField(newField.id, { value: 'https://newdomain.com' });
  const updated = store.getState().contactFields.find(f => f.id === newField.id);
  assert.equal(updated.value, 'https://newdomain.com');

  // Remove
  store.removeContactField(newField.id);
  assert.equal(store.getState().contactFields.length, 3);
});

test('store manages action buttons: add, update, remove', () => {
  const store = createStudioStore();

  // Remove button
  const firstId = store.getState().buttons[0].id;
  store.removeButton(firstId);
  assert.equal(store.getState().buttons.length, 2);

  // Add button
  const newBtn = store.addButton({
    icon: 'calendar',
    label: 'Book Call',
    url: 'https://cal.com/alex',
    style: 'accent'
  });
  assert.equal(store.getState().buttons.length, 3);
  assert.equal(store.getState().buttons[2].label, 'Book Call');

  // Update button
  store.updateButton(newBtn.id, { label: 'Schedule 15m' });
  const updatedBtn = store.getState().buttons.find(b => b.id === newBtn.id);
  assert.equal(updatedBtn.label, 'Schedule 15m');
});

test('applyThemePreset updates colors and styling correctly', () => {
  const store = createStudioStore();
  store.applyThemePreset('emerald-neon');
  const state = store.getState();
  assert.equal(state.themePreset, 'emerald-neon');
  assert.equal(state.accentColor, THEME_PRESETS['emerald-neon'].accentColor);
  assert.equal(state.bgColor, THEME_PRESETS['emerald-neon'].bgColor);
});

test('loadPresetByCardId maps card IDs to valid states', () => {
  const card1 = loadPresetByCardId(1); // Standard Card
  assert.equal(card1.layout, 'compact-card');

  const card3 = loadPresetByCardId(3); // Developer Landscape V2
  assert.equal(card3.layout, 'landscape-v2');
  assert.equal(card3.accentColor, '#38bdf8');
});

test('store manages widthMode switching', () => {
  const store = createStudioStore();
  assert.equal(store.getState().widthMode, 'responsive');

  store.setField('widthMode', 'fixed');
  assert.equal(store.getState().widthMode, 'fixed');
});

test('store supports undo and redo for editor changes', () => {
  const store = createStudioStore();
  const originalName = store.getState().fullName;
  store.setField('fullName', 'Jordan Lee');
  assert.equal(store.canUndo(), true);
  store.undo();
  assert.equal(store.getState().fullName, originalName);
  store.redo();
  assert.equal(store.getState().fullName, 'Jordan Lee');
});

test('getContactSymbol and getContactPlaceholders return correct symbols and hints for contact types', () => {
  assert.equal(getContactSymbol('email'), 'mail');
  assert.equal(getContactSymbol('location'), 'location_on');
  assert.equal(getContactSymbol('address'), 'location_on');
  assert.equal(getContactSymbol('map'), 'location_on');
  assert.equal(getContactSymbol('phone'), 'call');
  assert.equal(getContactSymbol('mobile'), 'call');
  assert.equal(getContactSymbol('website'), 'language');
  assert.equal(getContactSymbol('calendar'), 'calendar_month');
  assert.equal(getContactSymbol('linkedin'), 'badge');
  assert.equal(getContactSymbol('github'), 'code');
  assert.equal(getContactSymbol('custom'), 'star');

  const emailHint = getContactPlaceholders('email');
  assert.ok(emailHint.val.includes('name@domain.com'));
  assert.ok(emailHint.href.includes('mailto:'));

  const locHint = getContactPlaceholders('location');
  assert.ok(locHint.val.includes('Cebu City'));
  assert.ok(locHint.href.includes('Optional map link'));

  const phoneHint = getContactPlaceholders('phone');
  assert.ok(phoneHint.val.includes('Phone number'));
  assert.ok(phoneHint.href.startsWith('tel:'));
});

test('getButtonSymbol returns expected symbols for button icons', () => {
  assert.equal(getButtonSymbol('github'), 'code');
  assert.equal(getButtonSymbol('linkedin'), 'badge');
  assert.equal(getButtonSymbol('download'), 'download');
  assert.equal(getButtonSymbol('globe'), 'language');
  assert.equal(getButtonSymbol('website'), 'language');
  assert.equal(getButtonSymbol('calendar'), 'calendar_month');
  assert.equal(getButtonSymbol('none'), 'link_off');
  assert.equal(getButtonSymbol('other'), 'link');
});

