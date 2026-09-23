/**
 * Signature Studio - State Controller & UI Pipeline
 * Controls dynamic contact fields, action buttons, theme presets, live preview, and clipboard copying.
 */

import {
  renderSignatureHTML,
  DEFAULT_SIGNATURE_STATE,
  THEME_PRESETS,
  CONTACT_ICON_MAP,
  BUTTON_ICON_MAP
} from './studio-templates.js';

/**
 * Creates an isolated studio reactive state store.
 */
export function createStudioStore(initialState = DEFAULT_SIGNATURE_STATE) {
  let state = JSON.parse(JSON.stringify(initialState));
  const listeners = new Set();

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  return {
    getState() {
      return JSON.parse(JSON.stringify(state));
    },

    setState(newState) {
      state = JSON.parse(JSON.stringify(newState));
      notify();
    },

    setField(key, value) {
      state[key] = value;
      notify();
    },

    addContactField(field = {}) {
      const id = 'c_' + Math.random().toString(36).substring(2, 9);
      const newField = {
        id,
        type: field.type || 'phone',
        label: field.label || 'Contact',
        value: field.value || '',
        href: field.href || ''
      };
      if (!Array.isArray(state.contactFields)) {
        state.contactFields = [];
      }
      state.contactFields.push(newField);
      notify();
      return newField;
    },

    updateContactField(id, patch) {
      if (!Array.isArray(state.contactFields)) return;
      const index = state.contactFields.findIndex(f => f.id === id);
      if (index !== -1) {
        state.contactFields[index] = { ...state.contactFields[index], ...patch };
        notify();
      }
    },

    removeContactField(id) {
      if (!Array.isArray(state.contactFields)) return;
      state.contactFields = state.contactFields.filter(f => f.id !== id);
      notify();
    },

    addButton(btn = {}) {
      const id = 'b_' + Math.random().toString(36).substring(2, 9);
      const newBtn = {
        id,
        icon: btn.icon || 'globe',
        label: btn.label || 'Website',
        url: btn.url || 'https://',
        style: btn.style || 'dark'
      };
      if (!Array.isArray(state.buttons)) {
        state.buttons = [];
      }
      state.buttons.push(newBtn);
      notify();
      return newBtn;
    },

    updateButton(id, patch) {
      if (!Array.isArray(state.buttons)) return;
      const index = state.buttons.findIndex(b => b.id === id);
      if (index !== -1) {
        state.buttons[index] = { ...state.buttons[index], ...patch };
        notify();
      }
    },

    removeButton(id) {
      if (!Array.isArray(state.buttons)) return;
      state.buttons = state.buttons.filter(b => b.id !== id);
      notify();
    },

    applyThemePreset(presetKey) {
      const preset = THEME_PRESETS[presetKey];
      if (!preset) return;
      state.themePreset = presetKey;
      state.bgColor = preset.bgColor;
      state.bgType = preset.bgType;
      state.bgGradientEnd = preset.bgGradientEnd;
      state.accentColor = preset.accentColor;
      state.textColorPrimary = preset.textColorPrimary;
      state.textColorSecondary = preset.textColorSecondary;
      state.textColorMuted = preset.textColorMuted;
      state.buttonBg = preset.buttonBg;
      state.buttonBorder = preset.buttonBorder;
      notify();
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
}

/**
 * Maps existing card IDs (1 to 4) into state presets for Studio.
 */
export function loadPresetByCardId(cardId) {
  const base = JSON.parse(JSON.stringify(DEFAULT_SIGNATURE_STATE));

  switch (Number(cardId)) {
    case 1: // Standard Card (Compact Vertical)
      return {
        ...base,
        layout: 'compact-card',
        maxWidth: 420,
        borderRadius: 16,
        themePreset: 'developer-cyan',
        bgColor: '#000440',
        bgType: 'solid',
        accentColor: '#38bdf8'
      };

    case 2: // Minimal Row
      return {
        ...base,
        layout: 'minimal-row',
        maxWidth: 680,
        borderRadius: 12,
        themePreset: 'slate-tech',
        bgColor: '#0f172a',
        bgType: 'solid',
        accentColor: '#38bdf8',
        buttons: base.buttons.slice(0, 2)
      };

    case 4: // Landscape Studio V1 (Cosmic Blue)
      return {
        ...base,
        layout: 'landscape-v2',
        maxWidth: 680,
        borderRadius: 16,
        themePreset: 'cosmic-blue',
        bgColor: '#070913',
        bgType: 'gradient',
        bgGradientEnd: '#1e1b4b',
        accentColor: '#60a5fa'
      };

    case 3: // Developer Landscape V2 (Default Studio)
    default:
      return {
        ...base,
        layout: 'landscape-v2',
        maxWidth: 680,
        borderRadius: 16,
        themePreset: 'developer-cyan',
        bgColor: '#000440',
        bgType: 'solid',
        accentColor: '#38bdf8'
      };
  }
}

/* ========================================================
   BROWSER DOM CONTROLLER
   ======================================================== */

let studioStore = null;

/**
 * Toast notification helper.
 */
export function showStudioToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-msg');
  if (toast && msg) {
    msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  } else {
    console.log('[Toast]', message);
  }
}

/**
 * Copies live-rendered signature DOM markup to clipboard.
 */
export async function copyStudioSignature() {
  const previewEl = document.getElementById('studio-preview-card');
  if (!previewEl) return;
  const html = previewEl.innerHTML.trim();
  if (!html) return;

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const textBlob = new Blob(['Email Signature - Ezekiel P. Villadolid'], { type: 'text/plain' });
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
      });
      await navigator.clipboard.write([item]);
      showStudioToast('Rich Signature Copied! Paste (Ctrl+V) into Gmail or Outlook.');
      return;
    }
  } catch (err) {
    console.warn('ClipboardItem write failed, using selection copy:', err);
  }

  // Selection fallback
  try {
    const range = document.createRange();
    range.selectNodeContents(previewEl);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    showStudioToast('Signature Copied! Ready to paste into email.');
  } catch (fallbackErr) {
    navigator.clipboard.writeText(html).then(() => {
      showStudioToast('Raw HTML copied to clipboard.');
    });
  }
}

/**
 * Copies raw HTML string to clipboard.
 */
export async function copyRawHTML() {
  const previewEl = document.getElementById('studio-preview-card');
  if (!previewEl) return;
  const html = previewEl.innerHTML.trim();
  try {
    await navigator.clipboard.writeText(html);
    showStudioToast('Raw HTML copied to clipboard!');
  } catch (err) {
    showStudioToast('Could not copy HTML: ' + err.message);
  }
}

/**
 * Downloads signature as standalone HTML file.
 */
export function downloadHTML() {
  const previewEl = document.getElementById('studio-preview-card');
  if (!previewEl) return;
  const html = previewEl.innerHTML.trim();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'signature-studio-export.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showStudioToast('Downloaded signature-studio-export.html');
}

/**
 * Switches between Studio Customizer and Template Gallery views.
 */
export function switchViewMode(mode) {
  document.body.classList.remove('view-mode-studio', 'view-mode-gallery');
  document.body.classList.add(mode === 'gallery' ? 'view-mode-gallery' : 'view-mode-studio');

  const tabStudio = document.getElementById('tab-btn-studio');
  const tabGallery = document.getElementById('tab-btn-gallery');
  if (tabStudio && tabGallery) {
    if (mode === 'gallery') {
      tabGallery.classList.add('active');
      tabStudio.classList.remove('active');
    } else {
      tabStudio.classList.add('active');
      tabGallery.classList.remove('active');
    }
  }
}

/**
 * Loads a card template into Studio and switches to Studio view.
 */
export function loadTemplateIntoStudio(cardId) {
  if (!studioStore) return;
  const newState = loadPresetByCardId(cardId);
  studioStore.setState(newState);
  syncControlsWithState(newState);
  switchViewMode('studio');
  showStudioToast(`Loaded Template ${cardId} into Studio!`);
}

/**
 * Re-renders the dynamic contact fields list in the sidebar.
 */
function renderContactFieldsList(store) {
  const container = document.getElementById('contact-fields-list');
  if (!container) return;

  const state = store.getState();
  container.innerHTML = '';

  state.contactFields.forEach((field, index) => {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';

    card.innerHTML = `
      <div class="dynamic-item-header">
        <select class="form-select field-type-select" data-id="${field.id}" style="width: 130px; padding: 4px 8px; font-size: 12px;">
          <option value="phone" ${field.type === 'phone' ? 'selected' : ''}>📞 Phone</option>
          <option value="email" ${field.type === 'email' ? 'selected' : ''}>✉️ Email</option>
          <option value="location" ${field.type === 'location' ? 'selected' : ''}>📍 Location</option>
          <option value="website" ${field.type === 'website' ? 'selected' : ''}>🌐 Website</option>
          <option value="calendar" ${field.type === 'calendar' ? 'selected' : ''}>📅 Calendar</option>
          <option value="custom" ${field.type === 'custom' ? 'selected' : ''}>⭐ Custom</option>
        </select>
        <button type="button" class="btn-remove-item" data-action="remove-contact" data-id="${field.id}" title="Remove Field">✕</button>
      </div>
      <div class="form-row">
        <input type="text" class="form-input field-val-input" data-id="${field.id}" placeholder="Display Text" value="${field.value || ''}" style="font-size: 12px; padding: 6px 10px;" />
        <input type="text" class="form-input field-href-input" data-id="${field.id}" placeholder="Link (tel:, mailto:, https://)" value="${field.href || ''}" style="font-size: 12px; padding: 6px 10px;" />
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Re-renders the dynamic action buttons list in the sidebar.
 */
function renderActionButtonsList(store) {
  const container = document.getElementById('action-buttons-list');
  if (!container) return;

  const state = store.getState();
  container.innerHTML = '';

  state.buttons.forEach((btn, index) => {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';

    card.innerHTML = `
      <div class="dynamic-item-header">
        <div style="display: flex; gap: 6px; flex: 1;">
          <select class="form-select btn-icon-select" data-id="${btn.id}" style="width: 110px; padding: 4px 8px; font-size: 12px;">
            <option value="github" ${btn.icon === 'github' ? 'selected' : ''}>GitHub</option>
            <option value="linkedin" ${btn.icon === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
            <option value="download" ${btn.icon === 'download' ? 'selected' : ''}>Download</option>
            <option value="globe" ${btn.icon === 'globe' ? 'selected' : ''}>Globe</option>
            <option value="calendar" ${btn.icon === 'calendar' ? 'selected' : ''}>Calendar</option>
            <option value="twitter" ${btn.icon === 'twitter' ? 'selected' : ''}>Twitter</option>
            <option value="none" ${btn.icon === 'none' ? 'selected' : ''}>No Icon</option>
          </select>
          <select class="form-select btn-style-select" data-id="${btn.id}" style="width: 100px; padding: 4px 8px; font-size: 12px;">
            <option value="dark" ${btn.style === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="brand" ${btn.style === 'brand' ? 'selected' : ''}>Brand</option>
            <option value="accent" ${btn.style === 'accent' ? 'selected' : ''}>Accent</option>
          </select>
        </div>
        <button type="button" class="btn-remove-item" data-action="remove-btn" data-id="${btn.id}" title="Remove Button">✕</button>
      </div>
      <div class="form-row">
        <input type="text" class="form-input btn-label-input" data-id="${btn.id}" placeholder="Button Label" value="${btn.label || ''}" style="font-size: 12px; padding: 6px 10px;" />
        <input type="text" class="form-input btn-url-input" data-id="${btn.id}" placeholder="URL (https://...)" value="${btn.url || ''}" style="font-size: 12px; padding: 6px 10px;" />
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Synchronizes DOM form control values with the current state.
 */
function syncControlsWithState(state) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setVal('ctrl-layout', state.layout);
  setVal('ctrl-width-mode', state.widthMode || 'responsive');
  setVal('ctrl-max-width', state.maxWidth);
  setVal('ctrl-border-radius', state.borderRadius);
  setVal('ctrl-full-name', state.fullName);
  setVal('ctrl-job-title', state.jobTitle);
  setVal('ctrl-logo-url', state.logoUrl);
  setVal('ctrl-bg-color', state.bgColor);
  setVal('ctrl-bg-type', state.bgType);
  setVal('ctrl-bg-gradient-end', state.bgGradientEnd);
  setVal('ctrl-accent-color', state.accentColor);
  setVal('ctrl-text-primary', state.textColorPrimary);
  setVal('ctrl-text-secondary', state.textColorSecondary);

  // Update slider label and display numbers
  const lblWidth = document.getElementById('lbl-max-width');
  if (lblWidth) {
    lblWidth.textContent = state.widthMode === 'fixed' ? 'Fixed Width' : 'Max Width';
  }
  const wVal = document.getElementById('val-max-width');
  if (wVal) wVal.textContent = state.maxWidth + 'px';
  const rVal = document.getElementById('val-border-radius');
  if (rVal) rVal.textContent = state.borderRadius + 'px';

  // Highlight active theme preset chip
  document.querySelectorAll('.theme-chip').forEach(chip => {
    if (chip.getAttribute('data-preset') === state.themePreset) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  renderContactFieldsList(studioStore);
  renderActionButtonsList(studioStore);
}

/**
 * Initializes the entire Studio interactive environment.
 */
export function initStudio() {
  studioStore = createStudioStore(DEFAULT_SIGNATURE_STATE);

  // Global window references for HTML event hooks
  window.studioStore = studioStore;
  window.loadTemplateIntoStudio = loadTemplateIntoStudio;
  window.switchViewMode = switchViewMode;
  window.copyStudioSignature = copyStudioSignature;
  window.copyRawHTML = copyRawHTML;
  window.downloadHTML = downloadHTML;

  const previewCard = document.getElementById('studio-preview-card');
  const canvasWrapper = document.getElementById('studio-canvas-wrapper');

  // Preview update listener
  function updatePreview() {
    if (previewCard) {
      const state = studioStore.getState();
      previewCard.innerHTML = renderSignatureHTML(state);
    }
  }

  studioStore.subscribe(updatePreview);

  // Initial render
  updatePreview();
  syncControlsWithState(studioStore.getState());

  // Navigation tab event listeners
  const tabStudio = document.getElementById('tab-btn-studio');
  const tabGallery = document.getElementById('tab-btn-gallery');
  if (tabStudio) tabStudio.addEventListener('click', () => switchViewMode('studio'));
  if (tabGallery) tabGallery.addEventListener('click', () => switchViewMode('gallery'));

  // Collapsible accordion sections
  document.querySelectorAll('.control-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.control-section');
      if (section) section.classList.toggle('collapsed');
    });
  });

  // Top-level input bindings
  const bindInput = (id, key, transform = (v) => v) => {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = el.type === 'range' || el.type === 'text' || el.type === 'color' ? 'input' : 'change';
    el.addEventListener(evt, (e) => {
      studioStore.setField(key, transform(e.target.value));
    });
  };

  bindInput('ctrl-layout', 'layout');
  bindInput('ctrl-width-mode', 'widthMode', (mode) => {
    const lbl = document.getElementById('lbl-max-width');
    if (lbl) lbl.textContent = mode === 'fixed' ? 'Fixed Width' : 'Max Width';
    return mode;
  });
  bindInput('ctrl-max-width', 'maxWidth', Number);
  bindInput('ctrl-border-radius', 'borderRadius', Number);
  bindInput('ctrl-full-name', 'fullName');
  bindInput('ctrl-job-title', 'jobTitle');
  bindInput('ctrl-logo-url', 'logoUrl');
  bindInput('ctrl-bg-color', 'bgColor');
  bindInput('ctrl-bg-type', 'bgType');
  bindInput('ctrl-bg-gradient-end', 'bgGradientEnd');
  bindInput('ctrl-accent-color', 'accentColor');
  bindInput('ctrl-text-primary', 'textColorPrimary');
  bindInput('ctrl-text-secondary', 'textColorSecondary');

  // Live slider display counters
  const sliderWidth = document.getElementById('ctrl-max-width');
  if (sliderWidth) {
    sliderWidth.addEventListener('input', (e) => {
      const el = document.getElementById('val-max-width');
      if (el) el.textContent = e.target.value + 'px';
    });
  }

  const sliderRadius = document.getElementById('ctrl-border-radius');
  if (sliderRadius) {
    sliderRadius.addEventListener('input', (e) => {
      const el = document.getElementById('val-border-radius');
      if (el) el.textContent = e.target.value + 'px';
    });
  }

  // Theme preset chips
  document.querySelectorAll('.theme-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const presetKey = chip.getAttribute('data-preset');
      studioStore.applyThemePreset(presetKey);
      syncControlsWithState(studioStore.getState());
    });
  });

  // Viewport switch
  const btnVpDesktop = document.getElementById('btn-vp-desktop');
  const btnVpMobile = document.getElementById('btn-vp-mobile');
  if (btnVpDesktop && btnVpMobile && canvasWrapper) {
    btnVpDesktop.addEventListener('click', () => {
      btnVpDesktop.classList.add('active');
      btnVpMobile.classList.remove('active');
      canvasWrapper.classList.remove('viewport-mobile');
    });
    btnVpMobile.addEventListener('click', () => {
      btnVpMobile.classList.add('active');
      btnVpDesktop.classList.remove('active');
      canvasWrapper.classList.add('viewport-mobile');
    });
  }

  // Dynamic Contact Fields Delegation
  const contactList = document.getElementById('contact-fields-list');
  if (contactList) {
    contactList.addEventListener('input', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      if (e.target.classList.contains('field-val-input')) {
        studioStore.updateContactField(id, { value: e.target.value });
      } else if (e.target.classList.contains('field-href-input')) {
        studioStore.updateContactField(id, { href: e.target.value });
      }
    });

    contactList.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      if (e.target.classList.contains('field-type-select')) {
        const type = e.target.value;
        let hrefPrefix = '';
        if (type === 'phone') hrefPrefix = 'tel:';
        if (type === 'email') hrefPrefix = 'mailto:';
        if (type === 'website') hrefPrefix = 'https://';
        studioStore.updateContactField(id, { type });
      }
    });

    contactList.addEventListener('click', (e) => {
      if (e.target.getAttribute('data-action') === 'remove-contact') {
        const id = e.target.getAttribute('data-id');
        studioStore.removeContactField(id);
        renderContactFieldsList(studioStore);
      }
    });
  }

  const btnAddContact = document.getElementById('btn-add-contact-field');
  if (btnAddContact) {
    btnAddContact.addEventListener('click', () => {
      studioStore.addContactField({
        type: 'website',
        label: 'Website',
        value: 'https://',
        href: 'https://'
      });
      renderContactFieldsList(studioStore);
    });
  }

  // Dynamic Buttons Delegation
  const buttonsList = document.getElementById('action-buttons-list');
  if (buttonsList) {
    buttonsList.addEventListener('input', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      if (e.target.classList.contains('btn-label-input')) {
        studioStore.updateButton(id, { label: e.target.value });
      } else if (e.target.classList.contains('btn-url-input')) {
        studioStore.updateButton(id, { url: e.target.value });
      }
    });

    buttonsList.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      if (e.target.classList.contains('btn-icon-select')) {
        studioStore.updateButton(id, { icon: e.target.value });
      } else if (e.target.classList.contains('btn-style-select')) {
        studioStore.updateButton(id, { style: e.target.value });
      }
    });

    buttonsList.addEventListener('click', (e) => {
      if (e.target.getAttribute('data-action') === 'remove-btn') {
        const id = e.target.getAttribute('data-id');
        studioStore.removeButton(id);
        renderActionButtonsList(studioStore);
      }
    });
  }

  const btnAddButton = document.getElementById('btn-add-button');
  if (btnAddButton) {
    btnAddButton.addEventListener('click', () => {
      const state = studioStore.getState();
      if (state.buttons && state.buttons.length >= 4) {
        showStudioToast('Maximum 4 action buttons allowed for email layout.');
        return;
      }
      studioStore.addButton({
        icon: 'globe',
        label: 'Website',
        url: 'https://',
        style: 'dark'
      });
      renderActionButtonsList(studioStore);
    });
  }

  // Action Buttons
  const btnCopyPrimary = document.getElementById('btn-studio-copy-primary');
  if (btnCopyPrimary) btnCopyPrimary.addEventListener('click', copyStudioSignature);

  const btnCopyHtml = document.getElementById('btn-studio-copy-html');
  if (btnCopyHtml) btnCopyHtml.addEventListener('click', copyRawHTML);

  const btnDownload = document.getElementById('btn-studio-download');
  if (btnDownload) btnDownload.addEventListener('click', downloadHTML);
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudio);
  } else {
    initStudio();
  }
}
