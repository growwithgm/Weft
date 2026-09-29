/**
 * Cart drawer and cart page: quantity changes (rules-aware stepper), remove, order note.
 * Every change goes through the Cart API with the `sections` parameter, so the drawer, the page
 * and the header count re-render from Liquid in one request. Shopify's messages show inline on
 * the affected line; checkout stays disabled while a wholesale line breaks its rule.
 */
import { cartRequest, announce } from '@weft/core';
import '@weft/quantity';

const W = window.Weft;
let queue = Promise.resolve();

function lineOf(el) {
  return el.closest('[data-line]');
}

function showLineError(line, message) {
  const box = line && line.querySelector('[data-line-error]');
  if (!box) return;
  box.textContent = message || '';
  box.hidden = !message;
}

function change(line, quantity, focusId) {
  queue = queue.then(async () => {
    const index = Number(line.dataset.line);
    line.setAttribute('aria-busy', 'true');
    try {
      const cart = await cartRequest(`${W.routes.cartChange}.js`, { line: index, quantity });
      announce(W.strings.cartUpdated || '');
      if (focusId) document.getElementById(focusId)?.focus();
      return cart;
    } catch (err) {
      line.removeAttribute('aria-busy');
      showLineError(line, err.message);
      const input = line.querySelector('input[name="updates[]"]');
      if (input && input.dataset.previous) input.value = input.dataset.previous;
    }
  });
  return queue;
}

let timer;
document.addEventListener('change', (e) => {
  const input = e.target.closest('[data-cart-form] input[name="updates[]"], [data-cart-page] input[name="updates[]"]');
  if (!input) return;
  const line = lineOf(input);
  if (!line) return;
  clearTimeout(timer);
  timer = setTimeout(() => change(line, Number(input.value) || 0, input.id), 300);
});

document.addEventListener('focusin', (e) => {
  const input = e.target.closest('input[name="updates[]"]');
  if (input) input.dataset.previous = input.value;
});

document.addEventListener('click', (e) => {
  const remove = e.target.closest('[data-line-remove]');
  if (!remove) return;
  const line = lineOf(remove);
  if (!line) return;
  e.preventDefault();
  change(line, 0);
});

document.addEventListener('change', (e) => {
  const note = e.target.closest('[data-cart-note]');
  if (!note) return;
  cartRequest(`${W.routes.cartUpdate}.js`, { note: note.value }).catch(() => {});
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('[data-cart-form], [data-cart-page]');
  if (!form) return;
  const checkout = form.querySelector('[data-checkout]');
  if (e.submitter === checkout && checkout && checkout.disabled) e.preventDefault();
});
