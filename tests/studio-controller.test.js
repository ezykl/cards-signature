import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createStudioStore,
  loadPresetByCardId,
  getContactSymbol,
  getContactPlaceholders,
  getButtonSymbol,
  createSignatureSvgWrapper,
  renderThemeCards,
  WIZARD_STEPS,
  initStudio,
  extractGithubUsername
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

  const card4 = loadPresetByCardId(4); // Boardroom Accent
  assert.equal(card4.layout, 'accent-bar');
  assert.equal(card4.fontFamily, 'serif');
  assert.equal(card4.buttonShape, 'sharp');

  const card5 = loadPresetByCardId(5); // Creative Split
  assert.equal(card5.layout, 'split-avatar');
  assert.equal(card5.buttonShape, 'pill');
  assert.equal(card5.titleStyle, 'uppercase');
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
  assert.equal(getButtonSymbol('calendly'), 'calendar_month');
  assert.equal(getButtonSymbol('terminal'), 'terminal');
  assert.equal(getButtonSymbol('figma'), 'draw');
  assert.equal(getButtonSymbol('youtube'), 'smart_display');
  assert.equal(getButtonSymbol('instagram'), 'photo_camera');
  assert.equal(getButtonSymbol('whatsapp'), 'chat');
  assert.equal(getButtonSymbol('discord'), 'forum');
  assert.equal(getButtonSymbol('none'), 'link_off');
  assert.equal(getButtonSymbol('other'), 'link');
});

test('createSignatureSvgWrapper wraps HTML in valid SVG foreignObject with dimensions', () => {
  const html = '<table width="580"><tr><td>Test</td></tr></table>';
  const svg = createSignatureSvgWrapper(html, 580, 240);
  assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'));
  assert.ok(svg.includes('width="580"'));
  assert.ok(svg.includes('height="240"'));
  assert.ok(svg.includes('<foreignObject'));
  assert.ok(svg.includes('Test'));
});

test('store manages editorMode and wizardStep navigation', () => {
  const store = createStudioStore();
  assert.equal(store.getState().editorMode, 'guided');
  assert.equal(store.getState().wizardStep, 1);

  store.setEditorMode('advanced');
  assert.equal(store.getState().editorMode, 'advanced');

  store.setEditorMode('guided');
  store.nextWizardStep();
  assert.equal(store.getState().wizardStep, 2);

  store.setWizardStep(5);
  assert.equal(store.getState().wizardStep, 5);
  store.nextWizardStep(); // Should clamp at 5
  assert.equal(store.getState().wizardStep, 5);

  store.prevWizardStep();
  assert.equal(store.getState().wizardStep, 4);
  store.setWizardStep(1);
  store.prevWizardStep(); // Should clamp at 1
  assert.equal(store.getState().wizardStep, 1);
});

test('renderThemeCards generates rich preview cards with backgrounds and active state', () => {
  const state = { ...DEFAULT_SIGNATURE_STATE, themePreset: 'cosmic-blue' };
  const html = renderThemeCards(state);

  assert.ok(html.includes('theme-preview-card'));
  assert.ok(html.includes('Cosmic Blue'));
  assert.ok(html.includes('data-preset="cosmic-blue"'));
  assert.ok(html.includes('active')); // cosmic-blue should be active
  assert.ok(html.includes('data-preset="developer-cyan"'));
  assert.ok(html.includes('theme-card-badge'));
});

test('step titles map correctly across 5 wizard steps', () => {
  assert.equal(WIZARD_STEPS.length, 5);
  assert.equal(WIZARD_STEPS[0].title, 'Identity & Profile');
  assert.equal(WIZARD_STEPS[1].title, 'Theme & Palette');
  assert.equal(WIZARD_STEPS[2].title, 'Layout & Typography');
  assert.equal(WIZARD_STEPS[3].title, 'Contacts & Social Links');
  assert.equal(WIZARD_STEPS[4].title, 'Final Output & Export');
});

test('initStudio renders action buttons into both wizard and advanced containers and binds click handlers', () => {
  const elements = new Map();
  const getEl = (id) => {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        innerHTML: '',
        value: '',
        hidden: false,
        disabled: false,
        style: {},
        dataset: {},
        listeners: {},
        classList: {
          toggle() {},
          add() {},
          remove() {},
          contains() { return false; }
        },
        setAttribute() {},
        addEventListener(type, fn) {
          this.listeners[type] = this.listeners[type] || [];
          this.listeners[type].push(fn);
        },
        contains() { return false; },
        querySelector() { return null; },
        scrollIntoView() {}
      });
    }
    return elements.get(id);
  };

  const navBtn = getEl('nav-studio-btn');
  navBtn.dataset.view = 'studio';

  globalThis.document = {
    activeElement: null,
    getElementById: (id) => getEl(id),
    querySelectorAll: (sel) => (sel === '[data-view]' ? [navBtn] : []),
    querySelector: () => null,
    addEventListener() {},
    body: {
      classList: {
        *[Symbol.iterator]() { yield 'view-mode-home'; },
        remove() {},
        add() {},
        toggle() {},
        contains() { return false; }
      }
    }
  };
  globalThis.localStorage = { getItem: () => null, setItem() {} };
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    location: { hash: '' },
    addEventListener() {},
    scrollTo() {}
  };

  try {
    initStudio();
    assert.ok(getEl('action-buttons-list').innerHTML.includes('dynamic-item-card'));
    assert.ok(getEl('wizard-action-buttons-list').innerHTML.includes('dynamic-item-card'));
    assert.ok(Array.isArray(navBtn.listeners.click) && navBtn.listeners.click.length > 0);
  } finally {
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.window;
  }
});

test('store reorders contactFields and buttons with moveContactField and moveButton', () => {
  const store = createStudioStore();
  const initialContacts = store.getState().contactFields.map(c => c.id);
  assert.deepEqual(initialContacts, ['c1', 'c2', 'c3']);

  // Move c2 up -> ['c2', 'c1', 'c3']
  store.moveContactField('c2', 'up');
  assert.deepEqual(store.getState().contactFields.map(c => c.id), ['c2', 'c1', 'c3']);

  // Moving first item up should be a no-op
  store.moveContactField('c2', 'up');
  assert.deepEqual(store.getState().contactFields.map(c => c.id), ['c2', 'c1', 'c3']);

  // Move c2 down -> ['c1', 'c2', 'c3']
  store.moveContactField('c2', 'down');
  assert.deepEqual(store.getState().contactFields.map(c => c.id), ['c1', 'c2', 'c3']);

  // Move buttons
  assert.deepEqual(store.getState().buttons.map(b => b.id), ['b1', 'b2', 'b3']);
  store.moveButton('b1', 'down');
  assert.deepEqual(store.getState().buttons.map(b => b.id), ['b2', 'b1', 'b3']);
});

test('extractGithubUsername detects handle from buttons or contact fields', () => {
  assert.equal(extractGithubUsername(DEFAULT_SIGNATURE_STATE), 'ezykl');
  assert.equal(extractGithubUsername({ buttons: [], contactFields: [] }), '');
});

test('initStudio renders reorder controls, updates media status pill, and handles initials avatar click', () => {
  const elements = new Map();
  const getEl = (id) => {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        innerHTML: '',
        textContent: '',
        className: '',
        value: '',
        hidden: true,
        disabled: false,
        style: {},
        dataset: {},
        listeners: {},
        classList: {
          toggle() {},
          add() {},
          remove() {},
          contains() { return false; }
        },
        setAttribute() {},
        addEventListener(type, fn) {
          this.listeners[type] = this.listeners[type] || [];
          this.listeners[type].push(fn);
        },
        contains() { return false; },
        querySelector() { return null; },
        scrollIntoView() {}
      });
    }
    return elements.get(id);
  };

  globalThis.document = {
    activeElement: null,
    getElementById: (id) => getEl(id),
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener() {},
    body: {
      classList: {
        *[Symbol.iterator]() {},
        remove() {},
        add() {},
        toggle() {},
        contains() { return false; }
      }
    }
  };
  globalThis.localStorage = { getItem: () => null, setItem() {} };
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    location: { hash: '' },
    addEventListener() {},
    scrollTo() {}
  };

  try {
    initStudio();
    // Verify reorder buttons exist in contact fields and action buttons
    assert.ok(getEl('contact-fields-list').innerHTML.includes('data-action="move-contact-up"'));
    assert.ok(getEl('contact-fields-list').innerHTML.includes('data-action="move-contact-down"'));
    assert.ok(getEl('action-buttons-list').innerHTML.includes('data-action="move-btn-up"'));
    assert.ok(getEl('action-buttons-list').innerHTML.includes('data-action="move-btn-down"'));

    // Trigger Initials Badge click
    const initialsBtn = getEl('btn-avatar-initials');
    assert.ok(Array.isArray(initialsBtn.listeners.click) && initialsBtn.listeners.click.length > 0);
    initialsBtn.listeners.click[0]();
    assert.ok(getEl('ctrl-logo-url').value.includes('ui-avatars.com/api/'));
    assert.equal(getEl('logo-url-status').hidden, false);
    assert.ok(getEl('logo-url-status').textContent.includes('Initials monogram badge'));
  } finally {
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.window;
  }
});






