/**
 * Quick add: loads <product url>?section_id=quick-add into the quick add drawer (product.js
 * handles variants and adding), and adds single-variant products straight from cards.
 */
import { openDialog, closeDialog, parseHTML, scan, cartRequest, getCart, bus, loadModule, announce } from '@weft/core';

const W = window.Weft;

export async function openQuickAdd(trigger) {
  const dialog = document.getElementById('QuickAdd');
  if (!dialog) {
    location.href = trigger.dataset.quickAdd;
    return;
  }
  const body = dialog.querySelector('[data-quick-add-body]');
  body.replaceChildren();
  body.setAttribute('aria-busy', 'true');
  openDialog(dialog, trigger);
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
    const result = await cartRequest(`${W.routes.cartAdd}.js`, new FormData(form));
    const cart = await getCart();
    bus.emit('cart:updated', { cart, count: cart.item_count });
    bus.emit('cart:added', { items: [result] });
    announce(`${result.product_title || ''} ✓`);
    if (W.settings.afterAdd === 'page') location.href = W.routes.cart;
    else if (W.settings.afterAdd === 'drawer' && document.getElementById('CartDrawer')) openDialog('CartDrawer', button);
  } catch (err) {
    announce(err.message);
    form.submit();
  } finally {
    if (button) button.removeAttribute('aria-busy');
  }
}

bus.on('cart:added', ({ source }) => {
  if (source && source.closest && source.closest('#QuickAdd')) closeDialog('QuickAdd', false);
});
