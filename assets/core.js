/**
 * Weft core: shared by every island.
 * - event bus, Section Rendering and Cart API helpers
 * - live-region announcer
 * - dialogs (drawers, modals, sheets) on native <dialog>, with deferred <template> content
 * - island loader: [data-module] elements load their module on visible / idle / interaction
 * - small global behaviours driven by theme settings (link preloading, external links,
 *   cart shake, tab messages, reveal on scroll, location notice)
 */

const W = (window.Weft = window.Weft || {});
const settings = W.settings || {};

/* ---------- event bus ---------- */
const target = new EventTarget();
export const bus = {
  on(name, fn) {
    const handler = (e) => fn(e.detail);
    target.addEventListener(name, handler);
    return () => target.removeEventListener(name, handler);
  },
  emit(name, detail) {
    target.dispatchEvent(new CustomEvent(name, { detail }));
  }
};

/* ---------- announcer ---------- */
export function announce(message) {
  const region = document.querySelector('[data-announcer]');
  if (!region || !message) return;
  region.textContent = '';
  requestAnimationFrame(() => (region.textContent = message));
}

/* ---------- money ---------- */
/**
 * Formats cents with the store's money format (window.Weft.moneyFormat, from Liquid), so
 * previews match Shopify's own formatting. Used only to display numbers that come from Liquid.
 */
export function formatMoney(cents, format = W.moneyFormat || '{{amount}}') {
  const value = Math.round(Number(cents) || 0);
  const fmt = (n, decimals, thousands, decimal) => {
    const fixed = (n / 100).toFixed(decimals);
    const [whole, frac] = fixed.split('.');
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    return frac ? grouped + decimal + frac : grouped;
  };
  return format.replace(/\{\{\s*(\w+)\s*\}\}/, (_, key) => {
    switch (key) {
      case 'amount_no_decimals': return fmt(value, 0, ',', '.');
      case 'amount_with_comma_separator': return fmt(value, 2, '.', ',');
      case 'amount_no_decimals_with_comma_separator': return fmt(value, 0, '.', ',');
      case 'amount_with_apostrophe_separator': return fmt(value, 2, "'", '.');
      case 'amount_no_decimals_with_space_separator': return fmt(value, 0, ' ', ',');
      case 'amount_with_space_separator': return fmt(value, 2, ' ', ',');
      case 'amount_with_period_and_space_separator': return fmt(value, 2, ' ', '.');
      default: return fmt(value, 2, ',', '.');
    }
  }).replace(/<[^>]*>/g, '');
}

/* ---------- fetch helpers ---------- */
export function parseHTML(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

/** Renders sections through the Section Rendering API. Returns { [id]: html }. */
export async function fetchSections(ids, url = location.pathname + location.search, signal) {
  const u = new URL(url, location.origin);
  u.searchParams.set('sections', [].concat(ids).join(','));
  const res = await fetch(u, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

/** Fetches one section as HTML (?section_id=). */
export async function fetchSection(id, url, signal) {
  const u = new URL(url, location.origin);
  u.searchParams.set('section_id', id);
  const res = await fetch(u, { signal });
  if (!res.ok) throw new Error(res.statusText);
  return parseHTML(await res.text());
}

/** Section ids on the page that re-render after cart changes. */
export function cartSectionIds() {
  return [...document.querySelectorAll('[data-cart-section]')].map((el) => el.dataset.cartSection).filter(Boolean);
}

/**
 * Cart API request with the `sections` parameter. Throws an Error carrying Shopify's
 * message (`description` or `message`) and status when the request fails.
 */
export async function cartRequest(route, body = {}, extraSections = []) {
  const sections = [...new Set([...cartSectionIds(), ...extraSections])];
  let init;
  if (body instanceof FormData) {
    if (sections.length) {
      body.append('sections', sections.join(','));
      body.append('sections_url', location.pathname);
    }
    init = { method: 'POST', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body };
  } else {
    const payload = { ...body };
    if (sections.length) {
      payload.sections = sections.join(',');
      payload.sections_url = location.pathname;
    }
    init = { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) };
  }
  const res = await fetch(route, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status) {
    const err = new Error(data.description || data.message || W.strings?.error || 'Error');
    err.status = res.status || data.status;
    err.data = data;
    throw err;
  }
  if (data.sections) renderSections(data.sections);
  const count = data.item_count ?? data.items_count;
  if (count != null || data.items) {
    bus.emit('cart:updated', { cart: data, count: count ?? (data.items || []).reduce((n, i) => n + i.quantity, 0) });
  }
  return data;
}

export async function getCart() {
  const res = await fetch(`${W.routes?.cart || '/cart'}.js`, { headers: { Accept: 'application/json' } });
  return res.json();
}

/** Replaces [data-cart-section] and #shopify-section-<id> content from Section Rendering output. */
export function renderSections(sections) {
  for (const [id, html] of Object.entries(sections || {})) {
    if (html == null) continue;
    const doc = parseHTML(html);
    const incoming = doc.getElementById(`shopify-section-${id}`) || doc.body.firstElementChild;
    const current = document.getElementById(`shopify-section-${id}`);
    if (!incoming || !current) continue;
    const openDialog = current.querySelector('dialog[open]');
    if (openDialog) {
      const inner = incoming.querySelector(`#${CSS.escape(openDialog.id)} [data-dialog-body]`);
      const target = openDialog.querySelector('[data-dialog-body]');
      if (inner && target) {
        target.replaceWith(inner);
        continue;
      }
    }
    current.replaceChildren(...incoming.childNodes);
  }
  scan(document);
}

/** Swaps elements marked [data-swap="key"] inside `root` with their counterpart in `doc`. */
export function swapKeys(root, doc, scopeSelector) {
  const scope = scopeSelector ? doc.querySelector(scopeSelector) : doc;
  if (!scope) return;
  root.querySelectorAll('[data-swap]').forEach((el) => {
    const next = scope.querySelector(`[data-swap="${CSS.escape(el.dataset.swap)}"]`);
    if (next) el.replaceWith(next.cloneNode(true));
    else el.hidden = true;
  });
  scan(root);
}

/* ---------- dialogs ---------- */
let lastOpener = null;

function hydrate(dialog) {
  dialog.querySelectorAll('template[data-deferred]').forEach((tpl) => tpl.replaceWith(tpl.content.cloneNode(true)));
  scan(dialog);
}

export function openDialog(idOrEl, opener) {
  const dialog = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
  if (!dialog) return dialog;
  // A dialog left open without being modal (or mid-close) would swallow the click: reset it first.
  if (dialog.open && (dialog.matches(':modal') && dialog.dataset.state !== 'closing')) return dialog;
  if (dialog.open) dialog.close();
  lastOpener = opener || document.activeElement;
  hydrate(dialog);
  document.querySelectorAll('dialog[open]').forEach((d) => d !== dialog && closeDialog(d, false));
  try {
    dialog.showModal();
  } catch {
    return null;
  }
  dialog.dataset.state = 'open';
  const focusTarget = dialog.querySelector('[autofocus]') || dialog.querySelector('[data-dialog-focus]');
  if (focusTarget) focusTarget.focus();
  setChatHidden(true);
  bus.emit('dialog:open', { id: dialog.id });
  return dialog;
}

export function closeDialog(idOrEl, restoreFocus = true) {
  const dialog = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
  if (!dialog || !dialog.open) return;
  dialog.dataset.state = 'closing';
  const done = () => {
    if (dialog.dataset.state !== 'closing') return; // reopened while the close animation ran
    dialog.close();
    dialog.dataset.state = 'closed';
    if (!document.querySelector('dialog[open]')) setChatHidden(false);
    if (restoreFocus && lastOpener && document.contains(lastOpener)) lastOpener.focus();
    bus.emit('dialog:close', { id: dialog.id });
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !dialog.matches('[data-animate]')) done();
  else setTimeout(done, 180);
}

function setChatHidden(hidden) {
  const chat = document.querySelector('[data-chat-button]');
  if (chat) chat.toggleAttribute('data-chat-hidden', hidden);
}

document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open-dialog]');
  if (opener) {
    const dialog = document.getElementById(opener.dataset.openDialog);
    if (dialog) {
      e.preventDefault();
      // If the dialog can't open, follow the link (e.g. the cart icon goes to /cart).
      if (!openDialog(dialog, opener)?.open && opener.href) location.assign(opener.href);
    }
    return;
  }
  const closer = e.target.closest('[data-close-dialog]');
  if (closer) {
    e.preventDefault();
    closeDialog(closer.closest('dialog'));
    return;
  }
  // Click on the backdrop (the dialog element itself, outside its panel).
  if (e.target instanceof HTMLDialogElement && e.target.open && e.target.hasAttribute('data-light-dismiss')) closeDialog(e.target);
});

document.addEventListener('cancel', (e) => {
  if (e.target instanceof HTMLDialogElement) {
    e.preventDefault();
    closeDialog(e.target);
  }
}, true);

/* ---------- island loader ---------- */
const loaded = new Map();
function load(src) {
  if (!loaded.has(src)) loaded.set(src, import(src).catch((err) => console.error(err)));
  return loaded.get(src);
}

const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
const visibility = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        obs.unobserve(entry.target);
        load(entry.target.dataset.module);
      }
    }, { rootMargin: '300px 0px' })
  : null;

export function scan(root = document) {
  root.querySelectorAll('[data-module]:not([data-module-bound])').forEach((el) => {
    el.setAttribute('data-module-bound', '');
    const src = el.dataset.module;
    const when = el.dataset.load || 'visible';
    if (when === 'eager') load(src);
    else if (when === 'idle') idle(() => load(src));
    else if (when === 'interaction') {
      const go = () => {
        ['pointerdown', 'focusin', 'mouseenter', 'touchstart'].forEach((t) => el.removeEventListener(t, go));
        load(src);
      };
      ['pointerdown', 'focusin', 'mouseenter', 'touchstart'].forEach((t) => el.addEventListener(t, go, { passive: true, once: true }));
    } else if (visibility) visibility.observe(el);
    else load(src);
  });
}
export { load as loadModule };

/* ---------- theme editor ---------- */
if (W.designMode) {
  document.addEventListener('shopify:section:load', (e) => scan(e.target));
  document.addEventListener('shopify:block:select', (e) => {
    const block = e.target;
    const dialog = block.closest('dialog');
    if (dialog && !dialog.open) openDialog(dialog);
    const details = block.closest('details');
    if (details) details.open = true;
    block.dispatchEvent(new CustomEvent('weft:reveal', { bubbles: true }));
  });
  document.addEventListener('shopify:section:unload', (e) => {
    e.target.querySelectorAll('dialog[open]').forEach((d) => d.close());
  });
}

/* ---------- quick add and card forms (loaded on first use) ---------- */
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-quick-add]');
  if (!trigger || !W.modules?.quickAdd) return;
  e.preventDefault();
  load(W.modules.quickAdd).then((m) => m && m.openQuickAdd(trigger));
});
document.addEventListener('submit', (e) => {
  const form = e.target.closest('[data-card-form]');
  if (!form || !W.modules?.quickAdd) return;
  e.preventDefault();
  load(W.modules.quickAdd).then((m) => m && m.addFromCard(form, e.submitter));
});

/* ---------- copy buttons (discount codes, share links) ---------- */
document.addEventListener('click', async (e) => {
  const button = e.target.closest('[data-copy-text]');
  if (!button) return;
  try {
    // Share links use the device share sheet on touch screens when available.
    if (button.hasAttribute('data-native-share') && navigator.share && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ url: button.dataset.copyText, title: document.title });
      return;
    }
    await navigator.clipboard.writeText(button.dataset.copyText);
    const label = button.textContent;
    button.textContent = button.dataset.copiedLabel || label;
    announce(button.textContent);
    setTimeout(() => (button.textContent = label), 2000);
  } catch (_) { /* clipboard blocked: the code stays visible to copy by hand */ }
});

/* ---------- card slideshow on hover (Theme settings > Product cards) ---------- */
document.addEventListener('pointerover', (e) => {
  const media = e.target.closest?.('[data-card-slideshow]');
  if (!media || media.dataset.sliding || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const images = [...media.querySelectorAll('.card__image')];
  let i = 1;
  media.dataset.sliding = '1';
  const step = () => {
    images.forEach((img, n) => img.classList.toggle('is-shown', n === i));
    media.classList.add('is-sliding');
    i = (i + 1) % images.length;
  };
  step();
  const timer = setInterval(step, 900);
  media.addEventListener('pointerleave', () => {
    clearInterval(timer);
    media.classList.remove('is-sliding');
    delete media.dataset.sliding;
  }, { once: true });
});

/* ---------- cart count, shake, vibrate ---------- */
bus.on('cart:updated', ({ count }) => {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
    el.hidden = !count;
  });
  document.querySelectorAll('[data-cart-count-label]').forEach((el) => {
    const label = count === 1 ? el.dataset.one : el.dataset.other;
    if (label) el.setAttribute('aria-label', label.replace('__count__', count));
  });
});
bus.on('cart:added', () => {
  if (settings.vibrate && navigator.vibrate) navigator.vibrate(40);
});

function cartShake() {
  if (!settings.cartShake) return;
  const icon = document.querySelector('[data-cart-icon]');
  const bubble = document.querySelector('[data-cart-count]');
  if (!icon || !bubble || bubble.hidden) return;
  try {
    const views = (Number(localStorage.getItem('weft:views')) || 0) + 1;
    localStorage.setItem('weft:views', String(views));
    if (views % (settings.cartShakeEvery || 5) === 0) icon.classList.add('is-shaking');
  } catch (_) { /* storage blocked */ }
}

/* ---------- links ---------- */
document.addEventListener('click', (e) => {
  if (!settings.externalNewTab || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const a = e.target.closest('a[href]');
  if (!a || a.target || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (!/^https?:$/.test(url.protocol) || url.host === location.host) return;
  e.preventDefault();
  window.open(url.href, '_blank', 'noopener');
});

function preloadLinks() {
  if (!settings.preloadLinks || document.querySelector('script[type="speculationrules"]')) return;
  const done = new Set();
  const prefetch = (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.hash || done.has(url.href) || /\/(cart|checkout|account)/.test(url.pathname)) return;
    done.add(url.href);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url.href;
    document.head.append(link);
  };
  document.addEventListener('pointerover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });
}

/* ---------- tab messages ---------- */
function tabMessages() {
  const t = settings.tabMessages;
  if (!t || !t.enabled) return;
  const original = document.title;
  let timer;
  document.addEventListener('visibilitychange', () => {
    clearTimeout(timer);
    if (document.hidden) {
      const messages = [t.one, t.two].filter(Boolean);
      let i = 0;
      timer = setTimeout(function tick() {
        document.title = messages[i++ % messages.length] || original;
        timer = setTimeout(tick, 3000);
      }, (t.delay || 3) * 1000);
    } else document.title = original;
  });
}

/* ---------- reveal on scroll ---------- */
function reveal() {
  if (!document.body.dataset.reveal || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add('reveal-pending');
      io.observe(el);
    }
  });
}

/* ---------- wholesale location notice ---------- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-location-link]');
  if (!link) return;
  try {
    sessionStorage.setItem('weft:location', link.dataset.locationLink);
  } catch (_) { /* storage blocked */ }
});
function locationNotice() {
  let name = null;
  try {
    name = sessionStorage.getItem('weft:location');
    sessionStorage.removeItem('weft:location');
  } catch (_) { /* storage blocked */ }
  const notice = document.querySelector('[data-location-notice]');
  if (!name || !notice) return;
  const text = notice.querySelector('[data-location-notice-text]');
  if (text) text.textContent = (W.strings?.locationUpdated || '').replace('__location__', name);
  notice.hidden = false;
  announce(text ? text.textContent : '');
}

/* ---------- boot ---------- */
scan(document);
cartShake();
preloadLinks();
tabMessages();
reveal();
locationNotice();
bus.emit('core:ready');
