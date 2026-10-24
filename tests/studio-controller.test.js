import fs from 'node:fs';
import path from 'node:path';
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
  extractGithubUsername,
  attachPreviewLogoLoader,
  switchProfileSlot,
  buildStateFromOnboarding,
  syncControls,
  LAYOUT_CYCLE
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

test('attachPreviewLogoLoader adds loading state to logo cell while image loads and removes it on load', () => {
  const cellClasses = new Set();
  const imgClasses = new Set();
  const imgListeners = {};

  const mockCell = {
    classList: {
      add: (...cls) => cls.forEach(c => cellClasses.add(c)),
      remove: (...cls) => cls.forEach(c => cellClasses.delete(c)),
      contains: c => cellClasses.has(c)
    }
  };

  const mockImg = {
    complete: false,
    naturalWidth: 0,
    parentElement: mockCell,
    closest: () => mockCell,
    classList: {
      add: (...cls) => cls.forEach(c => imgClasses.add(c)),
      remove: (...cls) => cls.forEach(c => imgClasses.delete(c)),
      contains: c => imgClasses.has(c)
    },
    addEventListener(type, fn) {
      imgListeners[type] = fn;
    }
  };

  const mockContainer = {
    querySelector: sel => (sel.includes('img[alt="Logo"]') ? mockImg : null)
  };

  attachPreviewLogoLoader(mockContainer, true);

  // While loading, cell should have preview-logo-cell and is-loading classes
  assert.equal(cellClasses.has('preview-logo-cell'), true);
  assert.equal(cellClasses.has('is-loading'), true);
  assert.equal(imgClasses.has('preview-logo-img'), true);

  // Simulate image load completion
  assert.equal(typeof imgListeners.load, 'function');
  imgListeners.load();

  // After load, is-loading is removed
  assert.equal(cellClasses.has('is-loading'), false);
});

test('switchProfileSlot persists per-slot state and initStudio wires inbox simulator and vCard buttons', () => {
  const storage = new Map();
  const elements = new Map();
  const getEl = (id) => {
    if (!elements.has(id)) {
      const classes = new Set();
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
          toggle(c, force) {
            if (force === undefined) {
              classes.has(c) ? classes.delete(c) : classes.add(c);
            } else {
              force ? classes.add(c) : classes.delete(c);
            }
          },
          add: (...cls) => cls.forEach(c => classes.add(c)),
          remove: (...cls) => cls.forEach(c => classes.delete(c)),
          contains: c => classes.has(c)
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

  const slot1Btn = getEl('slot-btn-1');
  slot1Btn.dataset.slot = 'slot-1';
  const slot2Btn = getEl('slot-btn-2');
  slot2Btn.dataset.slot = 'slot-2';

  globalThis.document = {
    activeElement: null,
    getElementById: (id) => getEl(id),
    querySelectorAll: (sel) => (sel === '[data-slot]' ? [slot1Btn, slot2Btn] : []),
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
  globalThis.localStorage = {
    getItem: (k) => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v))
  };
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    location: { hash: '' },
    addEventListener() {},
    scrollTo() {}
  };

  try {
    initStudio();

    // Verify vCard buttons have click handlers bound
    assert.ok(Array.isArray(getEl('btn-studio-download-vcf').listeners.click));
    assert.ok(Array.isArray(getEl('btn-wiz-download-vcf').listeners.click));

    // Verify Inbox Dark / Light simulator buttons toggle .inbox-sim-dark on #studio-canvas-wrapper
    const darkInboxBtn = getEl('btn-inbox-dark');
    const lightInboxBtn = getEl('btn-inbox-light');
    assert.ok(Array.isArray(darkInboxBtn.listeners.click));
    darkInboxBtn.listeners.click[0]();
    assert.equal(getEl('studio-canvas-wrapper').classList.contains('inbox-sim-dark'), true);

    lightInboxBtn.listeners.click[0]();
    assert.equal(getEl('studio-canvas-wrapper').classList.contains('inbox-sim-dark'), false);

    // Switch profile slots and verify independent state persistence
    getEl('ctrl-full-name').value = 'Slot One User';
    getEl('ctrl-full-name').listeners.input[0]({ target: getEl('ctrl-full-name') });

    switchProfileSlot('slot-2');
    assert.equal(storage.get('signature-studio-active-slot-v1'), 'slot-2');
    assert.equal(slot2Btn.classList.contains('active'), true);

    // Update name in slot-2
    getEl('ctrl-full-name').value = 'Slot Two Work User';
    getEl('ctrl-full-name').listeners.input[0]({ target: getEl('ctrl-full-name') });

    // Switch back to slot-1 and verify Slot One User is restored
    switchProfileSlot('slot-1');
    assert.equal(getEl('ctrl-full-name').value, 'Slot One User');
  } finally {
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.window;
  }
});

test('buildStateFromOnboarding generates complete signature state from user details and vibe', () => {
  const generated = buildStateFromOnboarding(DEFAULT_SIGNATURE_STATE, {
    fullName: 'Alex Rivera',
    jobTitle: 'Staff Engineer • Vercel',
    email: 'alex@vercel.com',
    phone: '+1 555 234 5678',
    location: 'San Francisco, CA',
    primaryUrl: 'https://github.com/alexrivera',
    vibe: 'cosmic-blue'
  });

  assert.equal(generated.fullName, 'Alex Rivera');
  assert.equal(generated.jobTitle, 'Staff Engineer • Vercel');
  assert.equal(generated.themePreset, 'cosmic-blue');
  assert.equal(generated.layout, 'landscape-v2');
  assert.equal(generated.wizardStep, 5);
  // Auto-detects GitHub handle from primaryUrl for avatar
  assert.equal(generated.logoUrl, 'https://github.com/alexrivera.png?size=256');
  assert.equal(generated.contactFields.length, 3);
  assert.equal(generated.contactFields[0].type, 'email');
  assert.equal(generated.contactFields[0].value, 'alex@vercel.com');
  assert.equal(generated.contactFields[0].href, 'mailto:alex@vercel.com');
  assert.equal(generated.contactFields[1].type, 'phone');
  assert.equal(generated.contactFields[1].href, 'tel:+15552345678');
  assert.equal(generated.contactFields[2].type, 'location');
  assert.equal(generated.contactFields[2].value, 'San Francisco, CA');
  assert.equal(generated.buttons[0].icon, 'github');
  assert.equal(generated.buttons[0].url, 'https://github.com/alexrivera');

  // When non-GitHub link is provided, builds Initials Monogram Badge
  const nonGh = buildStateFromOnboarding(DEFAULT_SIGNATURE_STATE, {
    fullName: 'Maya Lin',
    jobTitle: 'Creative Director',
    email: 'maya@studio.design',
    phone: '',
    location: '',
    primaryUrl: 'https://mayalin.design',
    vibe: 'creative-split'
  });
  assert.equal(nonGh.layout, 'split-avatar');
  assert.equal(nonGh.themePreset, 'rose-gold');
  assert.ok(nonGh.logoUrl.includes('ui-avatars.com/api/'));
  assert.equal(nonGh.contactFields.length, 1);
  assert.equal(nonGh.buttons[0].url, 'https://mayalin.design');
});

test('clicking Start creating for the first time opens onboarding modal and submitting generates signature', () => {
  const storage = new Map();
  const elements = new Map();
  const getEl = (id) => {
    if (!elements.has(id)) {
      const classes = new Set();
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
          toggle(c, force) {
            if (force === undefined) {
              classes.has(c) ? classes.delete(c) : classes.add(c);
            } else {
              force ? classes.add(c) : classes.delete(c);
            }
          },
          add: (...cls) => cls.forEach(c => classes.add(c)),
          remove: (...cls) => cls.forEach(c => classes.delete(c)),
          contains: c => classes.has(c)
        },
        setAttribute() {},
        addEventListener(type, fn) {
          this.listeners[type] = this.listeners[type] || [];
          this.listeners[type].push(fn);
        },
        contains() { return false; },
        querySelector() { return null; },
        querySelectorAll() { return []; },
        scrollIntoView() {},
        focus() {}
      });
    }
    return elements.get(id);
  };

  const startBtn = getEl('btn-hero-start');
  startBtn.dataset.view = 'studio';

  globalThis.document = {
    activeElement: null,
    getElementById: (id) => getEl(id),
    querySelectorAll: (sel) => (sel === '[data-view]' ? [startBtn] : []),
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
  globalThis.localStorage = {
    getItem: (k) => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v))
  };
  globalThis.window = {
    matchMedia: () => ({ matches: false }),
    location: { hash: '' },
    addEventListener() {},
    scrollTo() {}
  };

  try {
    initStudio();

    // First click on Start creating should open #onboarding-modal instead of skipping onboarding
    assert.equal(getEl('onboarding-modal').hidden, true);
    startBtn.listeners.click[0]();
    assert.equal(getEl('onboarding-modal').hidden, false);

    // Fill onboarding inputs and submit #onboarding-form
    getEl('onboard-full-name').value = 'Elena Rostova';
    getEl('onboard-job-title').value = 'AI Research Lead';
    getEl('onboard-email').value = 'elena@deepmind.google';
    getEl('onboard-phone').value = '+44 20 7946 0921';
    getEl('onboard-location').value = 'London, UK';
    getEl('onboard-primary-url').value = 'https://github.com/erostova';
    getEl('onboard-vibe').value = 'developer-cyan';

    const form = getEl('onboarding-form');
    assert.ok(Array.isArray(form.listeners.submit) && form.listeners.submit.length > 0);
    form.listeners.submit[0]({ preventDefault() {} });

    assert.equal(getEl('onboarding-modal').hidden, true);
    assert.equal(storage.get('signature-studio-onboarded-v1'), 'true');
    assert.equal(getEl('ctrl-full-name').value, 'Elena Rostova');
    assert.equal(getEl('studio-view').hidden, false);
  } finally {
    delete globalThis.document;
    delete globalThis.localStorage;
    delete globalThis.window;
  }
});

test('context-aware header and streamlined studio workspace contracts in index.html', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 1. Site header contains context-aware studio-only and home-only components
  assert.ok(html.includes('class="site-header"'));
  assert.ok(html.includes('studio-back-btn studio-only'));
  assert.ok(html.includes('header-divider studio-only'));
  assert.ok(html.includes('header-center studio-only'));
  assert.ok(html.includes('studio-header-actions studio-only'));
  assert.ok(html.includes('home-nav-links home-only'));

  // 2. Undo, Redo, Reset, and Quick Setup are hoisted into studio-header-actions
  assert.ok(html.includes('id="btn-undo"'));
  assert.ok(html.includes('id="btn-redo"'));
  assert.ok(html.includes('id="btn-reset"'));
  assert.ok(html.includes('id="btn-open-onboarding"'));

  // 3. Homepage trust-list removed to deduplicate with Guarantees section
  assert.ok(!html.includes('class="trust-list"'));
  assert.ok(html.includes('class="guarantees-grid"'));

  // 4. Studio topbar and duplicate profile slots removed from studio-view
  assert.ok(!html.includes('class="studio-topbar"'));
  assert.ok(html.includes('id="studio-title" class="sr-only"'));

  // 5. Step 3 contains wizard-layout-chips with all 5 architectures
  assert.ok(html.includes('wizard-layout-chips'));
  const layouts = ['landscape-v2', 'compact-card', 'minimal-row', 'accent-bar', 'split-avatar'];
  for (const layout of layouts) {
    assert.ok(
      html.includes(`data-comparator-layout="${layout}"`),
      `Expected index.html to contain layout chip for ${layout}`
    );
  }

  // 6. Home navbar has direct GitHub logo link and no Templates button
  assert.ok(!html.includes('data-view="gallery">Templates</button>'));
  assert.ok(html.includes('class="nav-repo-link icon-link"'));
  assert.ok(html.includes('https://github.com/ezykl/cards-signature'));

  // 7. Eyebrow badge and separate homepage comparator are omitted
  assert.ok(!html.includes('EMAIL-CLIENT COMPILED &bull; ZERO TRACKING'));
  assert.ok(!html.includes('id="layout-comparator-section"'));

  // 8. Hero preview bar contains layout stepper
  assert.ok(html.includes('id="btn-hero-prev-layout"'));
  assert.ok(html.includes('id="btn-hero-next-layout"'));
  assert.ok(html.includes('id="hero-layout-title"'));
  assert.ok(html.includes('id="hero-layout-counter"'));

  // 9. Hero preview contains Shuffle Design, Use this template, and centered viewport
  assert.ok(html.includes('id="btn-hero-shuffle-design"'));
  assert.ok(html.includes('id="btn-hero-use-template"'));
  assert.ok(html.includes('id="hero-layout-indicator"'));
  assert.ok(html.includes('class="hero-signature-viewport"'));
});

test('syncControls activates corresponding layout chip across comparator cards and wizard chips', () => {
  const elements = new Map();
  const getEl = (id) => {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        value: '',
        innerHTML: '',
        contains() { return false; },
        style: { setProperty() {} },
        classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
        setAttribute() {}
      });
    }
    return elements.get(id);
  };

  const createMockChip = (layout) => {
    let active = false;
    let checked = 'false';
    return {
      dataset: { comparatorLayout: layout },
      classList: {
        toggle(cls, val) { if (cls === 'active') active = Boolean(val); },
        contains(cls) { return cls === 'active' ? active : false; }
      },
      setAttribute(attr, val) {
        if (attr === 'aria-checked') checked = String(val);
      },
      get checked() { return checked; }
    };
  };

  const chipCompact = createMockChip('compact-card');
  const chipLandscape = createMockChip('landscape-v2');
  const chipAccent = createMockChip('accent-bar');
  const allChips = [chipCompact, chipLandscape, chipAccent];

  globalThis.document = {
    getElementById: (id) => getEl(id),
    querySelectorAll: (sel) => {
      if (sel === '[data-comparator-layout]') return allChips;
      return [];
    },
    querySelector: () => null
  };

  try {
    const testState = {
      ...DEFAULT_SIGNATURE_STATE,
      layout: 'compact-card'
    };

    syncControls(testState);

    assert.equal(chipCompact.classList.contains('active'), true);
    assert.equal(chipCompact.checked, 'true');

    assert.equal(chipLandscape.classList.contains('active'), false);
    assert.equal(chipLandscape.checked, 'false');

    assert.equal(chipAccent.classList.contains('active'), false);
    assert.equal(chipAccent.checked, 'false');
  } finally {
    delete globalThis.document;
  }
});

test('hero layout stepper cycles through all 5 architectures and syncs title and counter', () => {
  assert.equal(LAYOUT_CYCLE.length, 5);
  assert.deepEqual(
    LAYOUT_CYCLE.map(l => l.id),
    ['landscape-v2', 'compact-card', 'minimal-row', 'accent-bar', 'split-avatar']
  );

  const elements = new Map();
  const getEl = (id) => {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        value: '',
        textContent: '',
        innerHTML: '',
        contains() { return false; },
        style: { setProperty() {} },
        classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
        setAttribute() {}
      });
    }
    return elements.get(id);
  };

  const titleEl = getEl('hero-layout-title');
  const counterEl = getEl('hero-layout-counter');

  globalThis.document = {
    getElementById: (id) => getEl(id),
    querySelectorAll: () => [],
    querySelector: () => null
  };

  try {
    // 1. Sync for default state (landscape-v2) -> "Layout: Landscape V2", "1 / 5"
    syncControls({ ...DEFAULT_SIGNATURE_STATE, layout: 'landscape-v2' });
    assert.equal(titleEl.textContent, 'Layout: Landscape V2');
    assert.equal(counterEl.textContent, '1 / 5');

    // 2. Sync for minimal-row -> "Layout: Minimal Row", "3 / 5"
    syncControls({ ...DEFAULT_SIGNATURE_STATE, layout: 'minimal-row' });
    assert.equal(titleEl.textContent, 'Layout: Minimal Row');
    assert.equal(counterEl.textContent, '3 / 5');

    // 3. Sync for split-avatar -> "Layout: Split Avatar", "5 / 5"
    syncControls({ ...DEFAULT_SIGNATURE_STATE, layout: 'split-avatar' });
    assert.equal(titleEl.textContent, 'Layout: Split Avatar');
    assert.equal(counterEl.textContent, '5 / 5');
  } finally {
    delete globalThis.document;
  }
});

test('store supports shuffleDesign to randomize both layout and theme preset simultaneously', () => {
  const store = createStudioStore();
  const res = store.shuffleDesign();
  assert.ok(res.theme);
  assert.ok(res.layout);
  assert.equal(store.getState().themePreset, res.theme);
  assert.equal(store.getState().layout, res.layout);
  assert.equal(store.getState().bgColor, THEME_PRESETS[res.theme].bgColor);
});

test('email composer simulated tool buttons are buttons with type="button" and do not render as raw text spans', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  assert.ok(html.includes('<button type="button" class="composer-tool-btn" title="Send (Simulated)"'));
  assert.ok(html.includes('<button type="button" class="composer-tool-btn" title="Formatting (Simulated)"'));
  assert.ok(html.includes('<button type="button" class="composer-tool-btn" title="Attachments (Simulated)"'));
  assert.ok(html.includes('<button type="button" class="composer-tool-btn" title="Insert link (Simulated)"'));
  assert.ok(!html.includes('<span class="composer-tool-btn"'));
});










