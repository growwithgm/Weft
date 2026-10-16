/**
 * Quick add: loads <product url>?section_id=quick-add into the quick add drawer (product.js
 * handles variants and adding), adds straight from cards (single-variant products and the size
 * buttons on card images), opens the size sheet on touch screens, and handles card swatches.
 */
import { openDialog, closeDialog, parseHTML, scan, cartRequest, getCart, bus, loadModule, announce } from '@weft/core';

const W = window.Weft;

/* Custom options live in each product's own template, which quick add and cards can't render.
   They are read once per product from its page and cached: required fields always come along,
   the ones marked "Show in quick add" when the quick add section allows it. */
const optionCache = new Map();
function productOptions(url) {
  const key = new URL(url, location.origin).pathname;
  if (!optionCache.has(key)) {
    optionCache.set(key, fetch(key)
      .then((res) => (res.ok ? res.text() : ''))
      .then((html) => {
        const section = parseHTML(html).querySelector('[data-product-section]:not([data-quick-add-content])');
        return section ? [...section.querySelectorAll('[data-custom-option]')] : [];
      })
      .catch(() => []));
  }
  return optionCache.get(key);
}

async function addOptions(content, url) {
  const marked = content.dataset.customOptions !== 'false';
  const form = content.querySelector('form[data-product-form]');
  if (!form) return;
  const fields = (await productOptions(url)).filter((el) => el.dataset.required === 'true' || (marked && el.dataset.inQuickAdd === 'true'));
  if (!fields.length) return;
  const anchor = content.querySelector('[data-buy-buttons]');
  for (const field of fields) {
    const copy = field.cloneNode(true);
    copy.querySelectorAll('[form]').forEach((el) => el.setAttribute('form', form.id));
    copy.querySelectorAll('[id]').forEach((el) => (el.id = `QA-${el.id}`));
    copy.querySelectorAll('[for]').forEach((el) => el.setAttribute('for', `QA-${el.getAttribute('for')}`));
    copy.querySelectorAll('[aria-describedby]').forEach((el) => el.setAttribute('aria-describedby', el.getAttribute('aria-describedby').split(' ').map((id) => `QA-${id}`).join(' ')));
    anchor ? anchor.before(copy) : form.before(copy);
  }
}

export async function openQuickAdd(trigger) {
  const dialog = document.getElementById('QuickAdd');
  if (!dialog) {
    location.href = trigger.dataset.quickAdd;
    return;
  }
  const body = dialog.querySelector('[data-quick-add-body]');
  body.replaceChildren();
  body.setAttribute('aria-busy', 'true');
  openDialog(dialog, trigger instanceof Element ? trigger : document.activeElement);
  try {
    await loadModule(W.modules.product);
    const url = new URL(trigger.dataset.quickAdd, location.origin);
    url.searchParams.set('section_id', 'quick-add');
    const res = await fetch(url);
    const doc = parseHTML(await res.text());
    const content = doc.querySelector('[data-quick-add-content]');
    doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      if (!document.querySelector(`link[href="${link.getAttribute('href')}"]`)) document.head.append(link);
    });
    if (content) {
      await addOptions(content, trigger.dataset.quickAdd);
      body.append(content);
      scan(body);
      body.querySelector('input, select, button')?.focus();
    } else location.href = trigger.dataset.quickAdd;
  } catch (_) {
    location.href = trigger.dataset.quickAdd;
  } finally {
    body.removeAttribute('aria-busy');
  }
}

export async function addFromCard(form, submitter) {
  const button = submitter || form.querySelector('button[type="submit"]');
  if (button) button.setAttribute('aria-busy', 'true');
  try {
    // A product with required custom options opens quick add instead, so they can't be skipped.
    if (form.dataset.productUrl && (await productOptions(form.dataset.productUrl)).some((el) => el.dataset.required === 'true')) {
      await openQuickAdd({ dataset: { quickAdd: form.dataset.productUrl } });
      return;
    }
    // Card size buttons each carry their variant: FormData only includes the clicked one when told.
    const data = new FormData(form);
    if (button && button.name) data.set(button.name, button.value);
    const result = await cartRequest(`${W.routes.cartAdd}.js`, data);
    form.classList.remove('is-open');
    form.querySelector('[data-card-error]')?.remove();
    const cart = await getCart();
    bus.emit('cart:updated', { cart, count: cart.item_count });
    bus.emit('cart:added', { items: [result] });
    announce(`${result.product_title || ''} ✓`);
    if (W.settings.afterAdd === 'page') location.href = W.routes.cart;
    else if (W.settings.afterAdd === 'drawer' && document.getElementById('CartDrawer')) openDialog('CartDrawer', button);
  } catch (err) {
    // Network failure: let the form post normally. Shopify refused the line: say why on the card.
    if (!err.status) {
      if (button && button.name) {
        const field = Object.assign(document.createElement('input'), { type: 'hidden', name: button.name, value: button.value });
        form.append(field);
      }
      form.submit();
      return;
    }
    let box = form.querySelector('[data-card-error]');
    if (!box) {
      box = document.createElement('p');
      box.className = 'card__error';
      box.setAttribute('role', 'alert');
      box.dataset.cardError = '';
      (form.querySelector('.card__quick-panel') || form).append(box);
    }
    box.textContent = err.message;
  } finally {
    if (button) button.removeAttribute('aria-busy');
  }
}

bus.on('cart:added', ({ source }) => {
  if (source && source.closest && source.closest('#QuickAdd')) closeDialog('QuickAdd', false);
});

/* ---------- product cards: swatches and the size sheet (snippets/card-options, card-quick-add) ---------- */
const WIDTHS = [240, 360, 480, 640, 800, 960];

function setSheet(card, open, returnFocus = true) {
  const form = card.querySelector('.card__quick');
  if (!form) return;
  form.classList.toggle('is-open', open);
  card.querySelectorAll('.card__quick-icon[aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
  if (open) form.querySelector('.card__quick-panel button:not([disabled]):not([data-card-sheet])')?.focus({ preventScroll: true });
  else if (returnFocus) card.querySelector('.card__quick-icon')?.focus({ preventScroll: true });
}

/* A swatch click shows that color: image, color name, links, and the variant behind each quick add button. */
function pickColor(card, swatch) {
  card.querySelectorAll('[data-card-pick]').forEach((b) => b.setAttribute('aria-pressed', String(b === swatch)));
  card.querySelectorAll('[data-card-color-name]').forEach((el) => (el.textContent = swatch.dataset.name || ''));
  const variants = (swatch.dataset.variants || '').split(',');
  card.querySelectorAll('[data-card-variant]').forEach((button) => {
    const [id, available] = (variants[Number(button.dataset.cardVariant)] || '').split(':');
    button.value = id || '';
    button.disabled = !id || available !== '1';
    const note = button.querySelector('[data-sold-out]');
    if (note) note.hidden = !button.disabled;
  });
  if (swatch.dataset.url) card.querySelectorAll('a.card__link, a.card__media').forEach((a) => (a.href = swatch.dataset.url));
  const src = swatch.dataset.image;
  const img = card.querySelector('.card__image--primary');
  if (src && img) {
    img.srcset = WIDTHS.map((w) => `${src.replace(/([?&]width=)\d+/, `$1${w}`)} ${w}w`).join(', ');
    img.src = src;
    card.classList.add('card--picked');
  }
}

export function cardControl(el) {
  const card = el.closest('[data-product-card]');
  if (!card) return;
  if (el.hasAttribute('data-card-pick')) pickColor(card, el);
  else if (el.hasAttribute('data-card-sheet')) setSheet(card, !card.querySelector('.card__quick')?.classList.contains('is-open'));
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const form = e.target.closest?.('.card__quick.is-open');
  if (form) setSheet(form.closest('[data-product-card]'), false);
});

