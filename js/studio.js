/** Signature Studio: accessible editor, local draft persistence, and exports. */
import { renderSignatureHTML, DEFAULT_SIGNATURE_STATE, THEME_PRESETS, getContrastRatio } from './studio-templates.js';

const DRAFT_KEY = 'signature-studio-draft-v2';
const clone = value => JSON.parse(JSON.stringify(value));
const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[char]);
const isSafeUrl = value => !value || /^(https?:|mailto:|tel:)/i.test(String(value).trim());

export function createStudioStore(initialState = DEFAULT_SIGNATURE_STATE) {
  let state = clone(initialState);
  let past = [];
  let future = [];
  const listeners = new Set();
  const commit = next => { past.push(clone(state)); if (past.length > 40) past.shift(); state = clone(next); future = []; notify(); };
  const notify = () => listeners.forEach(listener => listener(clone(state)));
  return {
    getState: () => clone(state),
    canUndo: () => past.length > 0, canRedo: () => future.length > 0,
    setState: next => commit(next),
    setField: (key, value) => commit({ ...state, [key]: value }),
    addContactField: (field = {}) => { const item = { id:`c_${cryptoId()}`, type:field.type || 'phone', label:field.label || 'Contact', value:field.value || '', href:field.href || '' }; commit({ ...state, contactFields:[...(state.contactFields || []), item] }); return item; },
    updateContactField: (id, patch) => commit({ ...state, contactFields:state.contactFields.map(field => field.id === id ? { ...field, ...patch } : field) }),
    removeContactField: id => commit({ ...state, contactFields:state.contactFields.filter(field => field.id !== id) }),
    addButton: (button = {}) => { const item = { id:`b_${cryptoId()}`, icon:button.icon || 'globe', label:button.label || 'Website', url:button.url || 'https://', style:button.style || 'dark' }; commit({ ...state, buttons:[...(state.buttons || []), item] }); return item; },
    updateButton: (id, patch) => commit({ ...state, buttons:state.buttons.map(button => button.id === id ? { ...button, ...patch } : button) }),
    removeButton: id => commit({ ...state, buttons:state.buttons.filter(button => button.id !== id) }),
    applyThemePreset: key => { const preset = THEME_PRESETS[key]; if (preset) commit({ ...state, ...preset, themePreset:key }); },
    shuffleThemePreset: () => {
      const keys = Object.keys(THEME_PRESETS);
      const available = keys.filter(k => k !== state.themePreset);
      const nextKey = available[Math.floor(Math.random() * available.length)] || keys[0];
      const preset = THEME_PRESETS[nextKey];
      if (preset) commit({ ...state, ...preset, themePreset: nextKey });
      return nextKey;
    },
    undo: () => { if (!past.length) return; future.push(clone(state)); state = past.pop(); notify(); },
    redo: () => { if (!future.length) return; past.push(clone(state)); state = future.pop(); notify(); },
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); }
  };
}

function cryptoId() { return globalThis.crypto?.randomUUID?.().slice(0, 8) || Math.random().toString(36).slice(2, 10); }

export function loadPresetByCardId(cardId) {
  const base = clone(DEFAULT_SIGNATURE_STATE);
  const variants = {
    1:{ layout:'compact-card', maxWidth:420, borderRadius:16, themePreset:'minimal-light' },
    2:{ layout:'minimal-row', maxWidth:680, borderRadius:10, themePreset:'slate-tech', buttons:base.buttons.slice(0, 2) },
    3:{ layout:'landscape-v2', maxWidth:680, borderRadius:16, themePreset:'developer-cyan' }
  };
  const variant = variants[Number(cardId)] || variants[3];
  return { ...base, ...THEME_PRESETS[variant.themePreset], ...variant };
}

let studioStore;
let toastTimer;

export function showStudioToast(message) { const toast = document.getElementById('toast'); const target = document.getElementById('toast-msg'); if (!toast || !target) return; target.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3600); }

function renderContactFields(state) {
  const target = document.getElementById('contact-fields-list'); if (!target) return;
  target.innerHTML = state.contactFields.map(field => `<article class="dynamic-item-card"><div class="dynamic-item-header"><label class="sr-only" for="type-${escapeHTML(field.id)}">Contact type</label><select id="type-${escapeHTML(field.id)}" class="form-select field-type-select" data-id="${escapeHTML(field.id)}"><option value="phone" ${field.type === 'phone' ? 'selected':''}>Phone</option><option value="email" ${field.type === 'email' ? 'selected':''}>Email</option><option value="location" ${field.type === 'location' ? 'selected':''}>Location</option><option value="website" ${field.type === 'website' ? 'selected':''}>Website</option><option value="calendar" ${field.type === 'calendar' ? 'selected':''}>Calendar</option><option value="custom" ${field.type === 'custom' ? 'selected':''}>Custom</option></select><button type="button" class="btn-remove-item" data-action="remove-contact" data-id="${escapeHTML(field.id)}" aria-label="Remove contact detail"><span class="material-symbols-rounded" aria-hidden="true">delete</span></button></div><div class="form-row"><label class="sr-only" for="value-${escapeHTML(field.id)}">Display text</label><input id="value-${escapeHTML(field.id)}" class="form-input field-val-input" data-id="${escapeHTML(field.id)}" placeholder="Display text" value="${escapeHTML(field.value)}" /><label class="sr-only" for="link-${escapeHTML(field.id)}">Link</label><input id="link-${escapeHTML(field.id)}" class="form-input field-href-input" data-id="${escapeHTML(field.id)}" placeholder="tel:, mailto:, or https://" value="${escapeHTML(field.href)}" /></div></article>`).join('');
}

function renderActionButtons(state) {
  const target = document.getElementById('action-buttons-list'); if (!target) return;
  target.innerHTML = state.buttons.map(button => {
    const isCustom = button.icon && !['github', 'linkedin', 'download', 'globe', 'website', 'none'].includes(button.icon);
    const customOption = isCustom ? `<option value="${escapeHTML(button.icon)}" selected>${escapeHTML(button.icon.charAt(0).toUpperCase() + button.icon.slice(1))}</option>` : '';
    return `<article class="dynamic-item-card"><div class="dynamic-item-header"><label class="sr-only" for="icon-${escapeHTML(button.id)}">Button icon</label><select id="icon-${escapeHTML(button.id)}" class="form-select btn-icon-select" data-id="${escapeHTML(button.id)}"><option value="github" ${button.icon === 'github' ? 'selected':''}>GitHub</option><option value="linkedin" ${button.icon === 'linkedin' ? 'selected':''}>LinkedIn</option><option value="download" ${button.icon === 'download' ? 'selected':''}>Download</option><option value="globe" ${button.icon === 'globe' || button.icon === 'website' ? 'selected':''}>Website</option>${customOption}<option value="none" ${button.icon === 'none' ? 'selected':''}>No icon</option></select><label class="sr-only" for="style-${escapeHTML(button.id)}">Button color</label><select id="style-${escapeHTML(button.id)}" class="form-select btn-style-select" data-id="${escapeHTML(button.id)}"><option value="dark" ${button.style === 'dark' ? 'selected':''}>Dark</option><option value="brand" ${button.style === 'brand' ? 'selected':''}>Brand</option><option value="accent" ${button.style === 'accent' ? 'selected':''}>Accent</option></select><button type="button" class="btn-remove-item" data-action="remove-btn" data-id="${escapeHTML(button.id)}" aria-label="Remove action link"><span class="material-symbols-rounded" aria-hidden="true">delete</span></button></div><div class="form-row"><label class="sr-only" for="label-${escapeHTML(button.id)}">Button label</label><input id="label-${escapeHTML(button.id)}" class="form-input btn-label-input" data-id="${escapeHTML(button.id)}" placeholder="Button label" value="${escapeHTML(button.label)}" /><label class="sr-only" for="url-${escapeHTML(button.id)}">Button URL</label><input id="url-${escapeHTML(button.id)}" class="form-input btn-url-input" data-id="${escapeHTML(button.id)}" placeholder="https://..." value="${escapeHTML(button.url)}" /></div></article>`;
  }).join('');
}

function renderThemeChips(state) {
  const container = document.querySelector('.theme-chip-group');
  if (!container) return;
  if (!container.dataset.rendered) {
    container.innerHTML = Object.entries(THEME_PRESETS).map(([key, preset]) => {
      const base = preset.bgColor;
      const end = preset.bgGradientEnd || preset.bgColor;
      const accent = preset.accentColor;
      return `<button type="button" class="theme-chip ${state.themePreset === key ? 'active' : ''}" data-preset="${key}" title="${escapeHTML(preset.name)}">
        <span class="swatch-dots" aria-hidden="true">
          <span class="swatch-dot" style="background:${base}"></span>
          <span class="swatch-dot" style="background:${end}"></span>
          <span class="swatch-dot" style="background:${accent}"></span>
        </span>
        <span class="theme-chip-name">${escapeHTML(preset.name)}</span>
      </button>`;
    }).join('');
    container.dataset.rendered = 'true';
  } else {
    container.querySelectorAll('.theme-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.preset === state.themePreset);
    });
  }
}

function syncControls(state) {
  const values = { 'ctrl-layout':state.layout, 'ctrl-width-mode':state.widthMode, 'ctrl-max-width':state.maxWidth, 'ctrl-border-radius':state.borderRadius, 'ctrl-full-name':state.fullName, 'ctrl-job-title':state.jobTitle, 'ctrl-logo-url':state.logoUrl, 'ctrl-bg-color':state.bgColor, 'ctrl-bg-type':state.bgType, 'ctrl-bg-gradient-end':state.bgGradientEnd, 'ctrl-bg-gradient-angle':state.bgGradientAngle, 'ctrl-accent-color':state.accentColor, 'ctrl-text-primary':state.textColorPrimary, 'ctrl-text-secondary':state.textColorSecondary };
  Object.entries(values).forEach(([id,value]) => { const el = document.getElementById(id); if (el) el.value = value ?? ''; });
  const fixed = state.widthMode === 'fixed'; const widthLabel = document.getElementById('lbl-max-width'); if (widthLabel) widthLabel.textContent = fixed ? 'Fixed width' : 'Maximum width';
  document.getElementById('val-max-width').value = `${state.maxWidth}px`; document.getElementById('val-border-radius').value = `${state.borderRadius}px`;
  
  const angleVal = document.getElementById('val-bg-gradient-angle');
  if (angleVal) angleVal.value = `${state.bgGradientAngle ?? 135}°`;
  const angleGrp = document.getElementById('grp-bg-angle');
  if (angleGrp) angleGrp.style.display = state.bgType === 'solid' ? 'none' : '';

  const contrastBadge = document.getElementById('contrast-badge');
  const contrastText = document.getElementById('contrast-text');
  const contrastIcon = document.getElementById('contrast-icon');
  if (contrastBadge && contrastText && state.bgColor && state.textColorPrimary) {
    const ratio = getContrastRatio(state.bgColor, state.textColorPrimary);
    const isGood = ratio >= 4.5;
    contrastBadge.className = `contrast-badge ${isGood ? 'contrast-good' : 'contrast-warning'}`;
    if (contrastIcon) contrastIcon.textContent = isGood ? 'verified' : 'warning';
    contrastText.textContent = isGood
      ? `WCAG AA Contrast: ${ratio.toFixed(1)}:1 (Good)`
      : `Low Contrast: ${ratio.toFixed(1)}:1 (Recommend >= 4.5:1)`;
  }

  renderThemeChips(state);
  document.getElementById('btn-undo').disabled = !studioStore.canUndo(); document.getElementById('btn-redo').disabled = !studioStore.canRedo();
  const complete = [state.fullName,state.jobTitle,state.contactFields?.some(field => field.value)].filter(Boolean).length; document.getElementById('completion-status').textContent = `Profile ${Math.round(complete / 3 * 100)}% complete`; document.querySelector('.editor-progress')?.style.setProperty('--progress', `${Math.round(complete / 3 * 100)}%`);
  const contactTarget = document.getElementById('contact-fields-list');
  const buttonTarget = document.getElementById('action-buttons-list');
  if (!contactTarget?.contains(document.activeElement)) renderContactFields(state);
  if (!buttonTarget?.contains(document.activeElement)) renderActionButtons(state);
}

function validate(state, focus = false) {
  const issues = []; const name = document.getElementById('ctrl-full-name'); const logo = document.getElementById('ctrl-logo-url');
  name?.setAttribute('aria-invalid', String(!state.fullName.trim())); logo?.setAttribute('aria-invalid', String(!isSafeUrl(state.logoUrl)));
  if (!state.fullName.trim()) issues.push('Enter the name you want recipients to see.');
  if (!isSafeUrl(state.logoUrl)) issues.push('Use a full http(s) URL for the logo image.');
  const summary = document.getElementById('form-error-summary'); summary.hidden = !issues.length; summary.textContent = issues.join(' '); if (issues.length && focus) summary.focus(); return !issues.length;
}

function renderGallery() { const target = document.getElementById('template-gallery'); if (!target) return; const cards = [{ id:3,name:'Developer landscape',description:'A confident, wide signature for portfolio and technical roles.',layout:'Landscape' },{ id:1,name:'Minimal card',description:'A centered profile presentation with a compact visual footprint.',layout:'Compact card' },{ id:2,name:'Executive row',description:'A concise layout designed for high-volume professional email.',layout:'Minimal row' }]; target.innerHTML = cards.map(card => `<article class="template-card"><div class="template-card-preview">${renderSignatureHTML(loadPresetByCardId(card.id))}</div><div><h2>${card.name}</h2><p>${card.description}</p></div><div class="template-card-footer"><span>${card.layout}</span><button type="button" class="button button-secondary" data-template="${card.id}">Use template</button></div></article>`).join(''); }

function setView(view) { ['home','studio','gallery'].forEach(name => { const section = document.getElementById(`${name}-view`); if (section) section.hidden = name !== view; }); [...document.body.classList].filter(name => name.startsWith('view-mode-')).forEach(name => document.body.classList.remove(name)); document.body.classList.add(`view-mode-${view}`); if (view === 'home') document.getElementById('home').scrollIntoView({ behavior:'smooth' }); else window.scrollTo({ top:0, behavior:'smooth' }); }

async function copyRichSignature() { const preview = document.getElementById('studio-preview-card'); if (!preview || !validate(studioStore.getState(), true)) return; const html = preview.innerHTML.trim(); try { if (navigator.clipboard && window.ClipboardItem) { await navigator.clipboard.write([new ClipboardItem({ 'text/html':new Blob([html],{type:'text/html'}), 'text/plain':new Blob(['Email signature'],{type:'text/plain'}) })]); showStudioToast('Signature copied. Paste it into your email settings.'); return; } throw new Error('Rich clipboard unavailable'); } catch { const range = document.createRange(); range.selectNodeContents(preview); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); document.execCommand('copy'); selection.removeAllRanges(); showStudioToast('Signature copied. Paste it into your email settings.'); } }
function copyRawHTML() { navigator.clipboard.writeText(document.getElementById('studio-preview-card').innerHTML.trim()).then(() => showStudioToast('HTML copied to clipboard.')).catch(() => showStudioToast('Copy failed. Please try again.')); }
function downloadHTML() { if (!validate(studioStore.getState(), true)) return; const blob = new Blob([document.getElementById('studio-preview-card').innerHTML.trim()],{type:'text/html;charset=utf-8'}); const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'),{href:url,download:'email-signature.html'}); link.click(); URL.revokeObjectURL(url); showStudioToast('HTML file downloaded.'); }
function exportDraft() { const blob = new Blob([JSON.stringify(studioStore.getState(),null,2)],{type:'application/json'}); const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'),{href:url,download:'signature-studio-draft.json'}); link.click(); URL.revokeObjectURL(url); showStudioToast('Editable draft exported.'); }
function importDraft(file) { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(reader.result); if (!data || typeof data !== 'object' || !Array.isArray(data.contactFields) || !Array.isArray(data.buttons)) throw new Error(); studioStore.setState({ ...clone(DEFAULT_SIGNATURE_STATE), ...data }); showStudioToast('Draft imported.'); } catch { showStudioToast('That file is not a valid Signature Studio draft.'); } }; reader.readAsText(file); }

export function initStudio() {
  let saved; try { saved = JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch { saved = null; }
  studioStore = createStudioStore(saved && typeof saved === 'object' ? { ...clone(DEFAULT_SIGNATURE_STATE), ...saved } : DEFAULT_SIGNATURE_STATE);
  const preview = document.getElementById('studio-preview-card'); const heroPreview = document.getElementById('hero-signature-preview'); const canvas = document.getElementById('studio-canvas-wrapper');
  studioStore.subscribe(state => { if (preview) preview.innerHTML = renderSignatureHTML(state); if (heroPreview) heroPreview.innerHTML = renderSignatureHTML(state); try { localStorage.setItem(DRAFT_KEY,JSON.stringify(state)); } catch {} syncControls(state); validate(state); });
  studioStore.setState(studioStore.getState()); renderGallery();
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
  document.querySelectorAll('a[data-nav="how-it-works"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      setView('home');
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.getElementById('template-gallery').addEventListener('click', event => { const button = event.target.closest('[data-template]'); if (!button) return; studioStore.setState(loadPresetByCardId(button.dataset.template)); setView('studio'); showStudioToast('Template loaded into the editor.'); });
  const bindings = { 'ctrl-layout':'layout','ctrl-width-mode':'widthMode','ctrl-max-width':'maxWidth','ctrl-border-radius':'borderRadius','ctrl-full-name':'fullName','ctrl-job-title':'jobTitle','ctrl-logo-url':'logoUrl','ctrl-bg-color':'bgColor','ctrl-bg-type':'bgType','ctrl-bg-gradient-end':'bgGradientEnd','ctrl-bg-gradient-angle':'bgGradientAngle','ctrl-accent-color':'accentColor','ctrl-text-primary':'textColorPrimary','ctrl-text-secondary':'textColorSecondary' };
  Object.entries(bindings).forEach(([id,key]) => { const input = document.getElementById(id); if (input) { input.addEventListener(input.type === 'select-one' ? 'change' : 'input', event => studioStore.setField(key, input.type === 'range' ? Number(event.target.value) : event.target.value)); input.addEventListener('blur', () => validate(studioStore.getState())); } });
  document.querySelector('.theme-chip-group')?.addEventListener('click', event => {
    const chip = event.target.closest('.theme-chip');
    if (!chip || !chip.dataset.preset) return;
    studioStore.applyThemePreset(chip.dataset.preset);
  });
  document.getElementById('btn-shuffle-theme')?.addEventListener('click', () => {
    const key = studioStore.shuffleThemePreset();
    showStudioToast(`Applied palette: ${THEME_PRESETS[key]?.name || key}`);
  });
  document.getElementById('contact-fields-list').addEventListener('input', event => { const id = event.target.dataset.id; if (event.target.matches('.field-val-input')) studioStore.updateContactField(id,{value:event.target.value}); if (event.target.matches('.field-href-input')) studioStore.updateContactField(id,{href:event.target.value}); });
  document.getElementById('contact-fields-list').addEventListener('change', event => { if (event.target.matches('.field-type-select')) studioStore.updateContactField(event.target.dataset.id,{type:event.target.value}); });
  document.getElementById('contact-fields-list').addEventListener('click', event => { const button = event.target.closest('[data-action="remove-contact"]'); if (button) { studioStore.removeContactField(button.dataset.id); renderContactFields(studioStore.getState()); } });
  document.getElementById('action-buttons-list').addEventListener('input', event => { const id = event.target.dataset.id; if (event.target.matches('.btn-label-input')) studioStore.updateButton(id,{label:event.target.value}); if (event.target.matches('.btn-url-input')) studioStore.updateButton(id,{url:event.target.value}); });
  document.getElementById('action-buttons-list').addEventListener('change', event => { const id = event.target.dataset.id; if (event.target.matches('.btn-icon-select')) studioStore.updateButton(id,{icon:event.target.value}); if (event.target.matches('.btn-style-select')) studioStore.updateButton(id,{style:event.target.value}); });
  document.getElementById('action-buttons-list').addEventListener('click', event => { const button = event.target.closest('[data-action="remove-btn"]'); if (button) { studioStore.removeButton(button.dataset.id); renderActionButtons(studioStore.getState()); } });
  document.getElementById('btn-add-contact-field').addEventListener('click', () => studioStore.addContactField({type:'website',label:'Website',value:'',href:'https://'}));
  document.getElementById('btn-add-button').addEventListener('click', () => { if (studioStore.getState().buttons.length >= 4) return showStudioToast('A signature can include up to four action links.'); studioStore.addButton(); });

  // Accessible theme toggle with dynamic state & ARIA attributes
  const darkToggle = document.getElementById('btn-toggle-dark');
  if (darkToggle) {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? JSON.parse(saved) : prefersDark;

    const updateThemeUI = (dark) => {
      document.body.classList.toggle('dark-mode', dark);
      darkToggle.setAttribute('aria-pressed', String(dark));
      darkToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      darkToggle.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
      const icon = darkToggle.querySelector('.theme-toggle-icon');
      if (icon) icon.textContent = dark ? 'light_mode' : 'dark_mode';
    };

    updateThemeUI(isDark);

    darkToggle.addEventListener('click', () => {
      const nextDark = !document.body.classList.contains('dark-mode');
      updateThemeUI(nextDark);
      localStorage.setItem('darkMode', JSON.stringify(nextDark));
    });
  }
  document.getElementById('btn-vp-desktop').addEventListener('click', () => { canvas.classList.remove('viewport-mobile'); document.getElementById('btn-vp-desktop').classList.add('active'); document.getElementById('btn-vp-mobile').classList.remove('active'); });
  document.getElementById('btn-vp-mobile').addEventListener('click', () => { canvas.classList.add('viewport-mobile'); document.getElementById('btn-vp-mobile').classList.add('active'); document.getElementById('btn-vp-desktop').classList.remove('active'); });
  document.getElementById('btn-undo').addEventListener('click', () => studioStore.undo()); document.getElementById('btn-redo').addEventListener('click', () => studioStore.redo()); document.getElementById('btn-reset').addEventListener('click', () => { if (confirm('Reset this draft to the default signature? Your saved browser draft will be replaced.')) { studioStore.setState(DEFAULT_SIGNATURE_STATE); showStudioToast('Draft reset to the default signature.'); } });
  document.getElementById('btn-studio-copy-primary').addEventListener('click', copyRichSignature); document.getElementById('btn-studio-copy-html').addEventListener('click', copyRawHTML); document.getElementById('btn-studio-download').addEventListener('click', downloadHTML); document.getElementById('btn-export-draft').addEventListener('click', exportDraft); document.getElementById('input-import-draft').addEventListener('change', event => importDraft(event.target.files[0]));
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initStudio) : initStudio();
