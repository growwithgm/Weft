/**
 * Wholesale ordering (brief §7.9–7.11):
 * - <order-matrix>: one stepper per variant with its own rule, stock cap and in-cart count;
 *   keyboard grid (arrows, Enter), typed values committed on blur with rounding notes,
 *   below-minimum flags, row totals, summary with a tier-aware subtotal preview, multi-line add
 *   with Shopify's result checked per line.
 * - <wholesale-quantity>: one-size buy box with live line total and inline rule errors.
 * - Volume pricing table: active row follows the quantity being edited; "Show all" toggle.
 * All numbers come from Liquid data attributes; Shopify's cart response is final.
 */
import { bus, announce, cartRequest, getCart, openDialog, formatMoney } from '@weft/core';
import { normalizeRule, lineCap, checkLine, stepUp, stepDown, commitTyped, unitPriceAt, activeBreak, summarize, minimumToAdd } from '@weft/rules';

const W = window.Weft;
const fill = (template, values) => Object.entries(values).reduce((s, [k, v]) => s.split(`__${k}__`).join(String(v)), template || '');
const plural = (strings, key, n) => fill(n === 1 ? strings[`${key}One`] : strings[`${key}Other`], { n });
const readJSON = (el, selector) => {
  try {
    return JSON.parse(el.querySelector(selector)?.textContent || '{}');
  } catch (_) {
    return {};
  }
};

function cellData(el) {
  const rule = normalizeRule({ min: el.dataset.min, increment: el.dataset.step, max: el.dataset.max });
  const stock = { tracked: el.dataset.tracked === 'true', available: Number(el.dataset.available) };
  let breaks = [];
  try {
    breaks = JSON.parse(el.dataset.breaks || '[]');
  } catch (_) { /* no tiers */ }
  return {
    el,
    id: el.dataset.variantId,
    rule,
    stock,
    inCart: Number(el.dataset.inCart) || 0,
    price: Number(el.dataset.price) || 0,
    breaks,
    label: el.dataset.label || '',
    cap: lineCap(rule, stock)
  };
}

function highlightTiers(section, total) {
  const table = section && section.querySelector('[data-tiers]');
  if (!table) return;
  table.querySelectorAll('.tiers__row').forEach((row) => {
    const from = Number(row.dataset.from);
    const to = row.dataset.to ? Number(row.dataset.to) : Infinity;
    const active = total > 0 && total >= from && total <= to;
    row.classList.toggle('is-active', active);
    const badge = row.querySelector('.tiers__badge');
    if (badge) badge.hidden = !active;
    if (active && row.hidden) row.hidden = false;
  });
}

/* ---------- order matrix ---------- */
class OrderMatrix extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.strings = readJSON(this, '[data-matrix-strings]');
    this.section = this.closest('product-section');
    this.form = this.querySelector('[data-matrix-form]');
    this.cells = [...this.querySelectorAll('[data-cell]')].map(cellData);
    this.byId = new Map(this.cells.map((c) => [c.id, c]));
    this.amounts = new Map();
    this.notes = new Map();
    this.errors = new Map();
    this.flash = [];
    // Add mode: cells start at 0 and inputs are no longer form fields (the no-JS form uses updates[]).
    this.cells.forEach((c) => {
      const input = this.inputOf(c);
      input.removeAttribute('name');
      input.value = '0';
      input.min = '0';
    });
    this.addEventListener('click', (e) => this.onClick(e));
    this.addEventListener('keydown', (e) => this.onKey(e));
    this.addEventListener('input', (e) => {
      if (e.target.matches('[data-cell-input]')) e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
    this.addEventListener('focusout', (e) => {
      if (e.target.matches('[data-cell-input]')) this.commit(this.cellOf(e.target));
    });
    this.addEventListener('focusin', (e) => {
      const cell = e.target.closest('[data-cell]') && this.cellOf(e.target);
      if (!cell) return;
      e.target.select && e.target.select();
      highlightTiers(this.section, cell.inCart + (this.amounts.get(cell.id) || 0));
      if (this.section && cell.el.dataset.mediaId) bus.emit('variant:change', { section: this.section, featuredMediaId: cell.el.dataset.mediaId });
    });
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.add();
    });
    this.setupRows();
    this.setupFilter();
    this.render();
  }

  setupRows() {
    this.openRow = () => {};
    // Quick order list: one variant per row, nothing collapses.
    if (this.hasAttribute('data-static-rows')) return;
    const mobile = matchMedia('(max-width: 989px)');
    const rows = [...this.querySelectorAll('[data-row]')];
    const setOpen = (row, open) => {
      row.toggleAttribute('data-open', open);
      row.querySelector('[data-row-toggle]')?.setAttribute('aria-expanded', String(open));
    };
    const apply = () => rows.forEach((row, i) => setOpen(row, !mobile.matches || i === 0));
    apply();
    mobile.addEventListener('change', apply);
    rows.forEach((row) => {
      row.querySelector('[data-row-head]')?.addEventListener('click', () => {
        if (mobile.matches) setOpen(row, !row.hasAttribute('data-open'));
      });
    });
    this.openRow = (row) => setOpen(row, true);
  }

  // Quick order list filter: matches name, variant and SKU (rows carry data-search in lower case).
  setupFilter() {
    const input = this.querySelector('[data-quick-filter]');
    if (!input) return;
    const empty = this.querySelector('[data-quick-empty]');
    input.addEventListener('input', () => {
      const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      this.querySelectorAll('[data-group]').forEach((group) => {
        let groupShown = 0;
        group.querySelectorAll('[data-row]').forEach((row) => {
          const match = terms.every((t) => (row.dataset.search || '').includes(t));
          row.hidden = !match;
          if (match) groupShown += 1;
        });
        group.hidden = groupShown === 0;
        shown += groupShown;
      });
      if (empty) {
        empty.hidden = shown > 0;
        empty.textContent = shown ? '' : this.strings.filterEmpty || '';
      }
    });
  }

  inputOf(cell) {
    return cell.el.querySelector('[data-cell-input]');
  }

  cellOf(node) {
    const el = node.closest('[data-cell]');
    return el ? this.byId.get(el.dataset.variantId) : null;
  }

  set(cell, value, note) {
    this.amounts.set(cell.id, Math.max(0, value));
    if (note) this.notes.set(cell.id, note);
    else this.notes.delete(cell.id);
    this.errors.delete(cell.id);
    this.flash = [];
    this.render();
  }

  onClick(e) {
    const clear = e.target.closest('[data-matrix-clear]');
    if (clear) {
      this.amounts.clear();
      this.notes.clear();
      this.errors.clear();
      this.flash = [];
      this.render();
      return;
    }
    const step = e.target.closest('[data-step]');
    if (!step || step.disabled) return;
    const cell = this.cellOf(step);
    if (!cell) return;
    const current = this.amounts.get(cell.id) || 0;
    const opts = { inCart: cell.inCart, cap: cell.cap };
    const next = Number(step.dataset.step) > 0 ? stepUp(current, cell.rule, opts) : stepDown(current, cell.rule, opts);
    this.set(cell, next);
  }

  commit(cell) {
    if (!cell) return;
    const input = this.inputOf(cell);
    const { value, note } = commitTyped(input.value, cell.rule, { inCart: cell.inCart, cap: cell.cap });
    let message = null;
    if (note === 'rounded') message = fill(this.strings.rounded, { line: cell.label, n: value, m: cell.rule.increment });
    if (note === 'capped') message = fill(this.strings.capped, { line: cell.label, n: value });
    if (value !== (this.amounts.get(cell.id) || 0) || message) this.set(cell, value, message);
    else input.value = String(value);
  }

  onKey(e) {
    const input = e.target.closest('[data-cell-input]');
    if (!input) return;
    const keys = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0], Enter: 'next' };
    const move = keys[e.key];
    if (!move) return;
    e.preventDefault();
    this.commit(this.cellOf(input));
    const inputs = [...this.querySelectorAll('[data-row]')].filter((row) => !row.closest('[hidden]')).map((row) => [...row.querySelectorAll('[data-cell-input], [data-cell-na]')]);
    let r = inputs.findIndex((row) => row.includes(input));
    let c = inputs[r].indexOf(input);
    const rtl = document.documentElement.dir === 'rtl';
    for (let guard = 0; guard < 200; guard++) {
      if (move === 'next') {
        c += 1;
        if (c >= inputs[r].length) { c = 0; r = (r + 1) % inputs.length; }
      } else {
        r += move[0];
        c += rtl ? -move[1] : move[1];
        if (r < 0 || r >= inputs.length || c < 0 || c >= inputs[r].length) return;
      }
      const target = inputs[r][c];
      if (target && target.matches('[data-cell-input]') && !target.disabled) {
        const row = target.closest('[data-row]');
        if (row && !row.hasAttribute('data-open')) this.openRow(row);
        target.focus();
        return;
      }
    }
  }

  lines() {
    return this.cells.map((c) => ({ amount: this.amounts.get(c.id) || 0, inCart: c.inCart, rule: c.rule, stock: c.stock, basePrice: c.price, breaks: c.breaks }));
  }

  render() {
    const s = this.strings;
    let invalid = 0;
    for (const cell of this.cells) {
      const amount = this.amounts.get(cell.id) || 0;
      const input = this.inputOf(cell);
      if (document.activeElement !== input || input.value === '') input.value = String(amount);
      const total = cell.inCart + amount;
      const check = checkLine(total, cell.rule, cell.stock);
      const disabled = input.disabled;
      const minus = cell.el.querySelector('[data-step="-1"]');
      const plus = cell.el.querySelector('[data-step="1"]');
      if (minus) minus.disabled = disabled || amount === 0;
      if (plus) plus.disabled = disabled || stepUp(amount, cell.rule, { inCart: cell.inCart, cap: cell.cap }) === amount;
      const flagged = amount > 0 && !check.valid;
      if (flagged) invalid += 1;
      const error = this.errors.get(cell.id) || (flagged && check.issue === 'below_min' ? fill(s.belowMin, { n: cell.rule.min }) : null);
      const errBox = cell.el.querySelector('[data-cell-error]');
      errBox.textContent = error || '';
      errBox.hidden = !error;
      cell.el.classList.toggle('is-invalid', !!error);
      cell.el.classList.toggle('is-filled', amount > 0);
      input.setAttribute('aria-invalid', String(!!error));
      const notes = [];
      if (cell.inCart) notes.push(fill(s.inCart, { n: cell.inCart }));
      const brk = amount > 0 ? activeBreak(total, cell.breaks) : null;
      if (brk) notes.push(fill(s.each, { price: formatMoney(brk.price) }));
      if (amount > 0 && Number.isFinite(cell.cap) && total + cell.rule.increment > cell.cap && total >= cell.rule.min) notes.push(fill(s.maxHint, { n: cell.cap - cell.inCart }));
      cell.el.querySelector('[data-cell-note]').textContent = notes.join(' · ');
      const lineTotal = cell.el.querySelector('[data-cell-line]');
      if (lineTotal) lineTotal.textContent = amount > 0 ? formatMoney(unitPriceAt(total, cell.price, cell.breaks) * amount) : '';
    }
    this.querySelectorAll('[data-row]').forEach((row) => {
      let rowTotal = 0;
      let flag = false;
      row.querySelectorAll('[data-cell]').forEach((el) => {
        const cell = this.byId.get(el.dataset.variantId);
        rowTotal += this.amounts.get(cell.id) || 0;
        if (el.classList.contains('is-invalid')) flag = true;
      });
      row.querySelectorAll('[data-row-total], [data-row-total-cell]').forEach((n) => (n.textContent = String(rowTotal)));
      const flagEl = row.querySelector('[data-row-flag]');
      if (flagEl) flagEl.hidden = !flag;
    });
    const sum = summarize(this.lines());
    const line = [plural(s, 'pieces', sum.pieces), sum.lines ? plural(s, 'lines', sum.lines) : null].filter(Boolean).join(', ');
    this.querySelector('[data-summary-line]').textContent = line;
    this.querySelector('[data-summary-subtotal]').textContent = formatMoney(sum.subtotal);
    const messages = [];
    if (invalid) messages.push({ text: plural(s, 'attention', invalid), tone: 'error' });
    this.notes.forEach((text) => messages.push({ text, tone: 'info' }));
    this.flash.forEach((m) => messages.push(m));
    const list = this.querySelector('[data-summary-messages]');
    list.replaceChildren(...messages.map((m) => {
      const li = document.createElement('li');
      li.className = `matrix__message matrix__message--${m.tone}`;
      li.textContent = m.text;
      return li;
    }));
    const add = this.querySelector('[data-matrix-add]');
    add.disabled = sum.pieces === 0 || invalid > 0 || this.busy;
    add.textContent = this.busy ? s.adding : plural(s, 'add', sum.pieces);
  }

  async add() {
    const items = this.cells.filter((c) => (this.amounts.get(c.id) || 0) > 0).map((c) => ({ id: Number(c.id), quantity: this.amounts.get(c.id) }));
    if (!items.length || this.busy) return;
    const expected = new Map(this.cells.map((c) => [c.id, c.inCart + (this.amounts.get(c.id) || 0)]));
    this.busy = true;
    this.render();
    let failure = null;
    try {
      await cartRequest(`${W.routes.cartAdd}.js`, { items });
    } catch (err) {
      failure = err;
    }
    let cart = null;
    try {
      cart = await getCart();
    } catch (_) { /* keep going */ }
    this.busy = false;
    const counts = new Map();
    (cart ? cart.items : []).forEach((i) => counts.set(String(i.variant_id), (counts.get(String(i.variant_id)) || 0) + i.quantity));
    let added = 0;
    let rejectedLabel = null;
    for (const cell of this.cells) {
      const now = cart ? counts.get(cell.id) || 0 : cell.inCart;
      const wanted = expected.get(cell.id);
      const requested = this.amounts.get(cell.id) || 0;
      if (requested && now < wanted) {
        this.errors.set(cell.id, (failure && failure.message) || fill(this.strings.capped, { line: cell.label, n: Math.max(0, now - cell.inCart) }));
        rejectedLabel = rejectedLabel || cell.label;
        this.amounts.set(cell.id, Math.max(0, wanted - now));
      } else if (requested) {
        this.amounts.delete(cell.id);
      }
      added += Math.max(0, now - cell.inCart);
      cell.inCart = now;
      cell.el.dataset.inCart = String(now);
    }
    this.notes.clear();
    this.flash = [];
    if (added) this.flash.push({ text: plural(this.strings, 'added', added), tone: 'success' });
    if (rejectedLabel) this.flash.push({ text: fill(this.strings.rejected, { line: rejectedLabel }), tone: 'error' });
    this.render();
    if (cart) bus.emit('cart:updated', { cart, count: cart.item_count });
    if (added) {
      bus.emit('cart:added', { items, source: this });
      announce(this.flash.map((m) => m.text).join(' '));
      if (!rejectedLabel && W.settings.afterAdd === 'drawer' && document.getElementById('CartDrawer')) openDialog('CartDrawer', this.querySelector('[data-matrix-add]'));
      else if (!rejectedLabel && W.settings.afterAdd === 'page') location.href = W.routes.cart;
    } else if (failure) announce(failure.message);
  }
}

/* ---------- one-size wholesale buy box ---------- */
class WholesaleQuantity extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.strings = readJSON(this, '[data-qty-strings]');
    this.data = cellData(this);
    this.section = this.closest('product-section');
    this.input = this.querySelector('quantity-input input, input[name="quantity"]');
    if (!this.input) return;
    // The stepper element's own min is the amount to add; keep it in sync with the in-cart count.
    const stepper = this.querySelector('quantity-input');
    if (stepper) stepper.dataset.min = String(minimumToAdd(this.data.rule, this.data.inCart));
    this.input.addEventListener('input', () => this.update(false));
    this.input.addEventListener('change', () => this.update(true));
    this.update(true);
  }

  update(committed) {
    const s = this.strings;
    const d = this.data;
    const amount = Math.max(0, Math.floor(Number(this.input.value) || 0));
    const total = d.inCart + amount;
    const check = checkLine(total, d.rule, d.stock);
    const unit = unitPriceAt(total, d.price, d.breaks);
    const line = this.querySelector('[data-line-total]');
    if (line) line.textContent = fill(s.line, { q: amount, price: formatMoney(unit), total: formatMoney(unit * amount) });
    let error = null;
    if (amount > 0 && !check.valid && committed) {
      if (check.issue === 'not_multiple') {
        const lower = check.lower != null ? check.lower - d.inCart : null;
        const upper = check.upper != null ? check.upper - d.inCart : null;
        error = lower != null && lower > 0 && upper != null
          ? fill(s.notMultiple, { q: amount, m: d.rule.increment, a: lower, b: upper })
          : fill(s.notMultipleOne, { q: amount, m: d.rule.increment, b: upper != null ? upper : lower });
      } else if (check.issue === 'below_min') error = fill(s.belowMin, { n: d.rule.min });
      else error = fill(s.onlyMore, { n: Math.max(0, d.cap - d.inCart) });
    }
    const box = this.querySelector('[data-form-error]');
    const text = this.querySelector('[data-form-error-text]');
    if (box && text && !box.dataset.shopify) {
      text.textContent = error || '';
      box.hidden = !error;
    }
    const button = this.querySelector('[data-add-button]');
    const label = this.querySelector('[data-add-label]');
    const blocked = this.querySelector('.wholesale-qty__hint--sold_out, .wholesale-qty__hint--below_min, .wholesale-qty__hint--unavailable');
    if (button && !blocked) {
      button.disabled = amount === 0 || (!check.valid && amount > 0);
      if (label && button.getAttribute('aria-busy') !== 'true') {
        label.textContent = fill(amount === 1 ? s.addOne : s.addOther, { n: amount });
        button.dataset.idleLabel = label.textContent;
      }
    }
    highlightTiers(this.section, total);
  }
}

/* ---------- tier table toggles (from the price link and "Show all") ---------- */
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('[data-tiers-toggle]');
  if (toggle) {
    const table = toggle.closest('[data-tiers]');
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    table.querySelectorAll('.tiers__row--extra').forEach((row) => (row.hidden = !open && !row.classList.contains('is-active')));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? toggle.dataset.less : toggle.dataset.more;
    return;
  }
  const priceLink = e.target.closest('[data-tier-toggle]');
  if (priceLink) {
    const table = priceLink.closest('product-section')?.querySelector('[data-tiers]');
    if (!table) return;
    table.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    table.classList.add('is-highlighted');
    setTimeout(() => table.classList.remove('is-highlighted'), 1200);
    priceLink.setAttribute('aria-expanded', 'true');
  }
});

if (!customElements.get('order-matrix')) customElements.define('order-matrix', OrderMatrix);
if (!customElements.get('wholesale-quantity')) customElements.define('wholesale-quantity', WholesaleQuantity);
