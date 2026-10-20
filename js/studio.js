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
    1: { layout: 'compact-card', maxWidth: 420, borderRadius: 16, themePreset: 'minimal-light' },
    2: { layout: 'minimal-row', maxWidth: 680, borderRadius: 10, themePreset: 'slate-tech', buttons: base.buttons.slice(0, 2) },
    3: { layout: 'landscape-v2', maxWidth: 680, borderRadius: 16, themePreset: 'developer-cyan', fontFamily: 'mono', buttonShape: 'pill' },
    4: { layout: 'accent-bar', maxWidth: 640, borderRadius: 8, themePreset: 'monochrome-pro', fontFamily: 'serif', buttonShape: 'sharp' },
    5: { layout: 'split-avatar', maxWidth: 660, borderRadius: 18, themePreset: 'rose-gold', fontFamily: 'grotesk', buttonShape: 'pill', titleStyle: 'uppercase' }
  };
  const variant = variants[Number(cardId)] || variants[3];
  return { ...base, ...THEME_PRESETS[variant.themePreset], ...variant };
}

let studioStore;
let toastTimer;

export function showStudioToast(message) { const toast = document.getElementById('toast'); const target = document.getElementById('toast-msg'); if (!toast || !target) return; target.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3600); }

export function getContactSymbol(type) {
  switch (type) {
    case 'email': return 'mail';
    case 'location':
    case 'address':
    case 'map': return 'location_on';
    case 'phone':
    case 'mobile': return 'call';
    case 'website':
    case 'portfolio': return 'language';
    case 'calendar': return 'calendar_month';
    case 'linkedin': return 'badge';
    case 'github': return 'code';
    default: return 'star';
  }
}

export function getContactPlaceholders(type) {
  switch (type) {
    case 'email':
      return { val: 'Email address (e.g. name@domain.com)', href: 'mailto:name@domain.com' };
    case 'location':
    case 'address':
      return { val: 'Location (e.g. San Roque, Cebu City)', href: 'Optional map link (https://...)' };
    case 'phone':
      return { val: 'Phone number (e.g. +63 993 938 9798)', href: 'tel:+639939389798' };
    case 'website':
      return { val: 'Website text (e.g. portfolio.dev)', href: 'https://portfolio.dev' };
    case 'calendar':
      return { val: 'Meeting text (e.g. Book 15m chat)', href: 'https://cal.com/your-name' };
    default:
      return { val: 'Display text', href: 'tel:, mailto:, or https://' };
  }
}

export function getButtonSymbol(icon) {
  switch (icon) {
    case 'github': return 'code';
    case 'code': return 'terminal';
    case 'terminal': return 'terminal';
    case 'figma': return 'draw';
    case 'linkedin': return 'badge';
    case 'x':
    case 'twitter': return 'tag';
    case 'youtube': return 'smart_display';
    case 'instagram': return 'photo_camera';
    case 'dribbble': return 'sports_basketball';
    case 'behance': return 'palette';
    case 'medium': return 'article';
    case 'substack': return 'bookmark';
    case 'spotify': return 'headphones';
    case 'calendly':
    case 'calendar': return 'calendar_month';
    case 'whatsapp': return 'chat';
    case 'telegram': return 'send';
    case 'discord': return 'forum';
    case 'email': return 'mail';
    case 'phone': return 'call';
    case 'chat': return 'sms';
    case 'download': return 'download';
    case 'globe':
    case 'website': return 'language';
    case 'document': return 'description';
    case 'location': return 'location_on';
    case 'star': return 'star';
    case 'none': return 'link_off';
    default: return 'link';
  }
}

function renderContactFields(state) {
  const target = document.getElementById('contact-fields-list'); if (!target) return;
  target.innerHTML = state.contactFields.map(field => {
    const symbol = getContactSymbol(field.type);
    const placeholders = getContactPlaceholders(field.type);
    return `<article class="dynamic-item-card">
      <div class="dynamic-item-header">
        <span class="dynamic-item-icon-badge" title="${escapeHTML(field.type)}" aria-hidden="true"><span class="material-symbols-rounded">${symbol}</span></span>
        <label class="sr-only" for="type-${escapeHTML(field.id)}">Contact type</label>
        <select id="type-${escapeHTML(field.id)}" class="form-select field-type-select" data-id="${escapeHTML(field.id)}">
          <option value="phone" ${field.type === 'phone' ? 'selected':''}>Phone</option>
          <option value="email" ${field.type === 'email' ? 'selected':''}>Email</option>
          <option value="location" ${field.type === 'location' ? 'selected':''}>Location</option>
          <option value="website" ${field.type === 'website' ? 'selected':''}>Website</option>
          <option value="calendar" ${field.type === 'calendar' ? 'selected':''}>Calendar</option>
          <option value="custom" ${field.type === 'custom' ? 'selected':''}>Custom</option>
        </select>
        <button type="button" class="btn-remove-item" data-action="remove-contact" data-id="${escapeHTML(field.id)}" aria-label="Remove contact detail">
          <span class="material-symbols-rounded" aria-hidden="true">delete</span>
        </button>
      </div>
      <div class="form-row">
        <label class="sr-only" for="value-${escapeHTML(field.id)}">Display text</label>
        <input id="value-${escapeHTML(field.id)}" class="form-input field-val-input" data-id="${escapeHTML(field.id)}" placeholder="${placeholders.val}" value="${escapeHTML(field.value)}" />
        <label class="sr-only" for="link-${escapeHTML(field.id)}">Link</label>
        <input id="link-${escapeHTML(field.id)}" class="form-input field-href-input" data-id="${escapeHTML(field.id)}" placeholder="${placeholders.href}" value="${escapeHTML(field.href)}" />
      </div>
    </article>`;
  }).join('');
}

function renderActionButtons(state) {
  const target = document.getElementById('action-buttons-list'); if (!target) return;
  const knownIcons = [
    'github', 'code', 'terminal', 'figma',
    'linkedin', 'x', 'twitter', 'youtube', 'instagram', 'dribbble', 'behance', 'medium', 'substack', 'spotify',
    'calendly', 'calendar', 'whatsapp', 'telegram', 'discord', 'email', 'phone', 'chat',
    'globe', 'website', 'download', 'document', 'location', 'star', 'link', 'none'
  ];
  target.innerHTML = state.buttons.map(button => {
    const symbol = getButtonSymbol(button.icon);
    const isCustom = button.icon && !knownIcons.includes(button.icon);
    const customOption = isCustom ? `<option value="${escapeHTML(button.icon)}" selected>${escapeHTML(button.icon.charAt(0).toUpperCase() + button.icon.slice(1))}</option>` : '';
    return `<article class="dynamic-item-card">
      <div class="dynamic-item-header">
        <span class="dynamic-item-icon-badge" title="${escapeHTML(button.label || button.icon)}" aria-hidden="true"><span class="material-symbols-rounded">${symbol}</span></span>
        <label class="sr-only" for="icon-${escapeHTML(button.id)}">Button icon</label>
        <select id="icon-${escapeHTML(button.id)}" class="form-select btn-icon-select" data-id="${escapeHTML(button.id)}">
          <optgroup label="Dev & Tools">
            <option value="github" ${button.icon === 'github' ? 'selected' : ''}>GitHub</option>
            <option value="code" ${button.icon === 'code' ? 'selected' : ''}>Code</option>
            <option value="terminal" ${button.icon === 'terminal' ? 'selected' : ''}>Terminal</option>
            <option value="figma" ${button.icon === 'figma' ? 'selected' : ''}>Figma</option>
          </optgroup>
          <optgroup label="Social & Media">
            <option value="linkedin" ${button.icon === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
            <option value="x" ${button.icon === 'x' || button.icon === 'twitter' ? 'selected' : ''}>X (Twitter)</option>
            <option value="youtube" ${button.icon === 'youtube' ? 'selected' : ''}>YouTube</option>
            <option value="instagram" ${button.icon === 'instagram' ? 'selected' : ''}>Instagram</option>
            <option value="dribbble" ${button.icon === 'dribbble' ? 'selected' : ''}>Dribbble</option>
            <option value="behance" ${button.icon === 'behance' ? 'selected' : ''}>Behance</option>
            <option value="medium" ${button.icon === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="substack" ${button.icon === 'substack' ? 'selected' : ''}>Substack</option>
            <option value="spotify" ${button.icon === 'spotify' ? 'selected' : ''}>Spotify</option>
          </optgroup>
          <optgroup label="Direct & Booking">
            <option value="calendly" ${button.icon === 'calendly' || button.icon === 'calendar' ? 'selected' : ''}>Calendly / Calendar</option>
            <option value="whatsapp" ${button.icon === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
            <option value="telegram" ${button.icon === 'telegram' ? 'selected' : ''}>Telegram</option>
            <option value="discord" ${button.icon === 'discord' ? 'selected' : ''}>Discord</option>
            <option value="email" ${button.icon === 'email' ? 'selected' : ''}>Email</option>
            <option value="phone" ${button.icon === 'phone' ? 'selected' : ''}>Phone</option>
            <option value="chat" ${button.icon === 'chat' ? 'selected' : ''}>Chat</option>
          </optgroup>
          <optgroup label="Actions & General">
            <option value="globe" ${button.icon === 'globe' || button.icon === 'website' ? 'selected' : ''}>Website</option>
            <option value="download" ${button.icon === 'download' ? 'selected' : ''}>Download</option>
            <option value="document" ${button.icon === 'document' ? 'selected' : ''}>Document</option>
            <option value="location" ${button.icon === 'location' ? 'selected' : ''}>Location</option>
            <option value="star" ${button.icon === 'star' ? 'selected' : ''}>Star</option>
            <option value="link" ${button.icon === 'link' ? 'selected' : ''}>Link</option>
            <option value="none" ${button.icon === 'none' ? 'selected' : ''}>No icon</option>
          </optgroup>
          ${customOption}
        </select>
        <label class="sr-only" for="style-${escapeHTML(button.id)}">Button color</label>
        <select id="style-${escapeHTML(button.id)}" class="form-select btn-style-select" data-id="${escapeHTML(button.id)}">
          <option value="dark" ${button.style === 'dark' ? 'selected':''}>Dark</option>
          <option value="brand" ${button.style === 'brand' ? 'selected':''}>Brand</option>
          <option value="accent" ${button.style === 'accent' ? 'selected':''}>Accent</option>
          <option value="outline" ${button.style === 'outline' ? 'selected':''}>Outline</option>
        </select>
        <button type="button" class="btn-remove-item" data-action="remove-btn" data-id="${escapeHTML(button.id)}" aria-label="Remove action link">
          <span class="material-symbols-rounded" aria-hidden="true">delete</span>
        </button>
      </div>
      <div class="form-row">
        <label class="sr-only" for="label-${escapeHTML(button.id)}">Button label</label>
        <input id="label-${escapeHTML(button.id)}" class="form-input btn-label-input" data-id="${escapeHTML(button.id)}" placeholder="Button label" value="${escapeHTML(button.label)}" />
        <label class="sr-only" for="url-${escapeHTML(button.id)}">Button URL</label>
        <input id="url-${escapeHTML(button.id)}" class="form-input btn-url-input" data-id="${escapeHTML(button.id)}" placeholder="https://..." value="${escapeHTML(button.url)}" />
      </div>
    </article>`;
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
  const values = {
    'ctrl-layout': state.layout,
    'ctrl-width-mode': state.widthMode,
    'ctrl-max-width': state.maxWidth,
    'ctrl-border-radius': state.borderRadius,
    'ctrl-full-name': state.fullName,
    'ctrl-job-title': state.jobTitle,
    'ctrl-logo-url': state.logoUrl,
    'ctrl-bg-color': state.bgColor,
    'ctrl-bg-type': state.bgType,
    'ctrl-bg-gradient-end': state.bgGradientEnd,
    'ctrl-bg-gradient-angle': state.bgGradientAngle,
    'ctrl-accent-color': state.accentColor,
    'ctrl-text-primary': state.textColorPrimary,
    'ctrl-text-secondary': state.textColorSecondary,
    'ctrl-font-family': state.fontFamily,
    'ctrl-name-font-size': state.nameFontSize,
    'ctrl-title-style': state.titleStyle,
    'ctrl-button-shape': state.buttonShape
  };
  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value ?? '';
  });
  const fixed = state.widthMode === 'fixed';
  const widthLabel = document.getElementById('lbl-max-width');
  if (widthLabel) widthLabel.textContent = fixed ? 'Fixed width' : 'Maximum width';
  const maxW = document.getElementById('val-max-width');
  if (maxW) maxW.value = `${state.maxWidth}px`;
  const radVal = document.getElementById('val-border-radius');
  if (radVal) radVal.value = `${state.borderRadius}px`;
  const nameSizeVal = document.getElementById('val-name-font-size');
  if (nameSizeVal) nameSizeVal.value = `${state.nameFontSize ?? 19}px`;
  
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

function renderGallery() {
  const target = document.getElementById('template-gallery');
  if (!target) return;
  const cards = [
    { id: 3, name: 'Developer landscape', description: 'A confident, wide signature for portfolio and technical roles.', layout: 'Landscape' },
    { id: 1, name: 'Minimal card', description: 'A centered profile presentation with a compact visual footprint.', layout: 'Compact card' },
    { id: 2, name: 'Executive row', description: 'A concise layout designed for high-volume professional email.', layout: 'Minimal row' },
    { id: 4, name: 'Boardroom accent', description: 'Distinguished left-accent bar with crisp serif typography and sharp CTA buttons.', layout: 'Accent bar' },
    { id: 5, name: 'Creative split', description: 'Modern two-column layout highlighting an avatar portrait with pill-shaped links.', layout: 'Split avatar' }
  ];
  target.innerHTML = cards.map(card => `<article class="template-card"><div class="template-card-preview">${renderSignatureHTML(loadPresetByCardId(card.id))}</div><div><h2>${card.name}</h2><p>${card.description}</p></div><div class="template-card-footer"><span>${card.layout}</span><button type="button" class="button button-secondary" data-template="${card.id}">Use template</button></div></article>`).join('');
}

function setView(view) { ['home','studio','gallery'].forEach(name => { const section = document.getElementById(`${name}-view`); if (section) section.hidden = name !== view; }); [...document.body.classList].filter(name => name.startsWith('view-mode-')).forEach(name => document.body.classList.remove(name)); document.body.classList.add(`view-mode-${view}`); if (view === 'home') document.getElementById('home').scrollIntoView({ behavior:'smooth' }); else window.scrollTo({ top:0, behavior:'smooth' }); }

async function copyRichSignature() { const preview = document.getElementById('studio-preview-card'); if (!preview || !validate(studioStore.getState(), true)) return; const html = preview.innerHTML.trim(); try { if (navigator.clipboard && window.ClipboardItem) { await navigator.clipboard.write([new ClipboardItem({ 'text/html':new Blob([html],{type:'text/html'}), 'text/plain':new Blob(['Email signature'],{type:'text/plain'}) })]); showStudioToast('Signature copied. Paste it into your email settings.'); return; } throw new Error('Rich clipboard unavailable'); } catch { const range = document.createRange(); const holder = document.createElement('div'); holder.style.cssText = 'position:fixed;left:-9999px;top:0;'; holder.innerHTML = html; document.body.appendChild(holder); range.selectNodeContents(holder); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); document.execCommand('copy'); selection.removeAllRanges(); holder.remove(); showStudioToast('Signature copied. Paste it into your email settings.'); } }
function copyRawHTML() { navigator.clipboard.writeText(document.getElementById('studio-preview-card').innerHTML.trim()).then(() => showStudioToast('HTML copied to clipboard.')).catch(() => showStudioToast('Copy failed. Please try again.')); }
function downloadHTML() { if (!validate(studioStore.getState(), true)) return; const blob = new Blob([document.getElementById('studio-preview-card').innerHTML.trim()],{type:'text/html;charset=utf-8'}); const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'),{href:url,download:'email-signature.html'}); link.click(); URL.revokeObjectURL(url); showStudioToast('HTML file downloaded.'); }

export function createSignatureSvgWrapper(html, width = 600, height = 300) {
  const safeW = Math.max(280, Number(width) || 600);
  const safeH = Math.max(100, Number(height) || 300);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${safeW}" height="${safeH}" viewBox="0 0 ${safeW} ${safeH}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="margin: 0; padding: 0; background: transparent;">
      ${html}
    </div>
  </foreignObject>
</svg>`;
}

export async function exportSignaturePNG() {
  const preview = document.getElementById('studio-preview-card');
  if (!preview || !validate(studioStore.getState(), true)) return;
  const btn = document.getElementById('btn-studio-download-png');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-rounded" aria-hidden="true">hourglass_top</span> Generating PNG...';
  }

  try {
    const table = preview.querySelector('table');
    const width = table ? Math.round(table.offsetWidth || table.getBoundingClientRect().width || 580) : 580;
    const height = table ? Math.round(table.offsetHeight || table.getBoundingClientRect().height || 260) : 260;

    const cloneDiv = document.createElement('div');
    cloneDiv.innerHTML = preview.innerHTML.trim();
    const images = Array.from(cloneDiv.querySelectorAll('img'));

    await Promise.all(images.map(async img => {
      try {
        const src = img.getAttribute('src');
        if (!src || src.startsWith('data:')) return;
        const res = await fetch(src, { mode: 'cors' });
        if (res.ok) {
          const blob = await res.blob();
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          img.setAttribute('src', base64);
        }
      } catch {
        // Continue if CORS blocks individual image
      }
    }));

    const svgString = createSignatureSvgWrapper(cloneDiv.innerHTML, width, height);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = svgUrl;
    });

    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(svgUrl);

    canvas.toBlob(blob => {
      if (!blob) {
        showStudioToast('Could not generate PNG image.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement('a'), {
        href: url,
        download: 'email-signature.png'
      });
      link.click();
      URL.revokeObjectURL(url);
      showStudioToast('PNG image signature downloaded.');
    }, 'image/png');
  } catch {
    showStudioToast('PNG export encountered an issue. Try HTML copy instead.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

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
  const bindings = {
    'ctrl-layout': 'layout',
    'ctrl-width-mode': 'widthMode',
    'ctrl-max-width': 'maxWidth',
    'ctrl-border-radius': 'borderRadius',
    'ctrl-full-name': 'fullName',
    'ctrl-job-title': 'jobTitle',
    'ctrl-logo-url': 'logoUrl',
    'ctrl-bg-color': 'bgColor',
    'ctrl-bg-type': 'bgType',
    'ctrl-bg-gradient-end': 'bgGradientEnd',
    'ctrl-bg-gradient-angle': 'bgGradientAngle',
    'ctrl-accent-color': 'accentColor',
    'ctrl-text-primary': 'textColorPrimary',
    'ctrl-text-secondary': 'textColorSecondary',
    'ctrl-font-family': 'fontFamily',
    'ctrl-name-font-size': 'nameFontSize',
    'ctrl-title-style': 'titleStyle',
    'ctrl-button-shape': 'buttonShape'
  };
  Object.entries(bindings).forEach(([id,key]) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener(input.type === 'select-one' ? 'change' : 'input', event => studioStore.setField(key, input.type === 'range' ? Number(event.target.value) : event.target.value));
      input.addEventListener('blur', () => validate(studioStore.getState()));
    }
  });
  const nameSizeInput = document.getElementById('ctrl-name-font-size');
  if (nameSizeInput) {
    nameSizeInput.addEventListener('input', event => {
      const out = document.getElementById('val-name-font-size');
      if (out) out.value = `${event.target.value}px`;
    });
  }
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
  document.getElementById('contact-fields-list').addEventListener('change', event => {
    if (event.target.matches('.field-type-select')) {
      const newType = event.target.value;
      const card = event.target.closest('.dynamic-item-card');
      const badge = card?.querySelector('.dynamic-item-icon-badge .material-symbols-rounded');
      if (badge) badge.textContent = getContactSymbol(newType);
      const valInput = card?.querySelector('.field-val-input');
      const hrefInput = card?.querySelector('.field-href-input');
      const placeholders = getContactPlaceholders(newType);
      if (valInput) valInput.placeholder = placeholders.val;
      if (hrefInput) hrefInput.placeholder = placeholders.href;
      studioStore.updateContactField(event.target.dataset.id, { type: newType });
    }
  });
  document.getElementById('contact-fields-list').addEventListener('click', event => { const button = event.target.closest('[data-action="remove-contact"]'); if (button) { studioStore.removeContactField(button.dataset.id); renderContactFields(studioStore.getState()); } });
  document.getElementById('action-buttons-list').addEventListener('input', event => { const id = event.target.dataset.id; if (event.target.matches('.btn-label-input')) studioStore.updateButton(id,{label:event.target.value}); if (event.target.matches('.btn-url-input')) studioStore.updateButton(id,{url:event.target.value}); });
  document.getElementById('action-buttons-list').addEventListener('change', event => {
    const id = event.target.dataset.id;
    if (event.target.matches('.btn-icon-select')) {
      const card = event.target.closest('.dynamic-item-card');
      const badge = card?.querySelector('.dynamic-item-icon-badge .material-symbols-rounded');
      if (badge) badge.textContent = getButtonSymbol(event.target.value);
      studioStore.updateButton(id, { icon: event.target.value });
    }
    if (event.target.matches('.btn-style-select')) {
      studioStore.updateButton(id, { style: event.target.value });
    }
  });
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
  document.getElementById('btn-undo').addEventListener('click', () => studioStore.undo());
  document.getElementById('btn-redo').addEventListener('click', () => studioStore.redo());
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('Reset this draft to the default signature? Your saved browser draft will be replaced.')) {
      studioStore.setState(DEFAULT_SIGNATURE_STATE);
      showStudioToast('Draft reset to the default signature.');
    }
  });
  document.getElementById('btn-studio-copy-primary').addEventListener('click', copyRichSignature);
  document.getElementById('btn-studio-copy-html').addEventListener('click', copyRawHTML);
  document.getElementById('btn-studio-download').addEventListener('click', downloadHTML);
  document.getElementById('btn-studio-download-png')?.addEventListener('click', exportSignaturePNG);
  document.getElementById('btn-export-draft').addEventListener('click', exportDraft);
  document.getElementById('input-import-draft').addEventListener('change', event => importDraft(event.target.files[0]));

  const initialHash = window.location.hash.replace('#', '');
  if (['studio', 'gallery', 'home'].includes(initialHash)) setView(initialHash);
  window.addEventListener('hashchange', () => {
    const next = window.location.hash.replace('#', '');
    if (['studio', 'gallery', 'home'].includes(next)) setView(next);
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initStudio) : initStudio();
