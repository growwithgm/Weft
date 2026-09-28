/**
 * <quantity-input>: stepper that follows quantity rules (min, increment, max). Typed values are
 * committed on blur and rounded to the increment (rules.js). Dispatches a bubbling `change` on
 * the input whenever the value changes.
 */
import { stepUp, stepDown, commitTyped } from '@weft/rules';

class QuantityInput extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.input = this.querySelector('input');
    this.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-quantity-step]');
      if (!btn || btn.disabled) return;
      const dir = Number(btn.dataset.quantityStep);
      const value = Number(this.input.value) || 0;
      const next = dir > 0 ? stepUp(value, this.rule, { cap: this.cap }) : this.down(value);
      this.set(next);
    });
    this.input.addEventListener('blur', () => {
      const { value } = commitTyped(this.input.value, this.rule, { cap: this.cap });
      const floor = this.hasAttribute('data-allow-zero') ? 0 : this.rule.min;
      this.set(Math.max(value, value === 0 ? floor : value), true);
    });
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.input.blur();
    });
    this.update();
  }

  get rule() {
    return { min: Number(this.dataset.min) || 1, increment: Number(this.dataset.step) || 1, max: this.dataset.max ? Number(this.dataset.max) : null };
  }

  get cap() {
    return this.dataset.max ? Number(this.dataset.max) : Infinity;
  }

  down(value) {
    const next = stepDown(value, this.rule);
    if (next === 0 && !this.hasAttribute('data-allow-zero')) return this.rule.min;
    return next;
  }

  set(value, force = false) {
    const prev = this.input.value;
    this.input.value = String(value);
    this.update();
    if (force || prev !== this.input.value) this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  update() {
    const value = Number(this.input.value) || 0;
    const minus = this.querySelector('[data-quantity-step="-1"]');
    const plus = this.querySelector('[data-quantity-step="1"]');
    const floor = this.hasAttribute('data-allow-zero') ? 0 : this.rule.min;
    if (minus) minus.disabled = this.input.disabled || value <= floor;
    if (plus) plus.disabled = this.input.disabled || stepUp(value, this.rule, { cap: this.cap }) === value;
  }
}

if (!customElements.get('quantity-input')) customElements.define('quantity-input', QuantityInput);
