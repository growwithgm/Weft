/**
 * Quick add: loads <product url>?section_id=quick-add into the quick add drawer (product.js
 * handles variants and adding), and adds single-variant products straight from cards.
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
    const result = await cartRequest(`${W.routes.cartAdd}.js`, new FormData(form));
    const cart = await getCart();
    bus.emit('cart:updated', { cart, count: cart.item_count });
    bus.emit('cart:added', { items: [result] });
    announce(`${result.product_title || ''} ✓`);
    if (W.settings.afterAdd === 'page') location.href = W.routes.cart;
    else if (W.settings.afterAdd === 'drawer' && document.getElementById('CartDrawer')) openDialog('CartDrawer', button);
  } catch (err) {
    // Network failure: let the form post normally. Shopify refused the line: say why on the card.
    if (!err.status) {
      form.submit();
      return;
    }
    let box = form.querySelector('[data-card-error]');
    if (!box) {
      box = document.createElement('p');
      box.className = 'card__error';
      box.setAttribute('role', 'alert');
      box.dataset.cardError = '';
      form.append(box);
    }
    box.textContent = err.message;
  } finally {
    if (button) button.removeAttribute('aria-busy');
  }
}

bus.on('cart:added', ({ source }) => {
  if (source && source.closest && source.closest('#QuickAdd')) closeDialog('QuickAdd', false);
});
