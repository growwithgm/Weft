/**
 * <product-section>: variant selection through the Section Rendering API (option value ids),
 * swapping every [data-swap] element so prices, rules and stock come from Liquid; AJAX add to
 * cart with inline errors; small product-page behaviours (guide link, share, flash messages,
 * gift card recipient, recently viewed).
 */
import { bus, announce, parseHTML, swapKeys, cartRequest, getCart, openDialog, scan } from '@weft/core';
import '@weft/quantity';

const W = window.Weft;

class ProductSection extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.sectionId = this.dataset.sectionId;
    this.productUrl = this.dataset.productUrl;
    this.enableInputs();
    this.initGuideLink();
    this.initFlash();
    this.addEventListener('change', (e) => {
      if (e.target.closest('[data-variant-picker]')) this.onOptionChange(e.target);
      if (e.target.matches('.gift-recipient__check')) this.onGiftToggle(e.target);
    });
    this.addEventListener('submit', (e) => {
      if (e.target.matches('[data-product-form]')) this.onSubmit(e);
    });
    this.addEventListener('input', (e) => {
      const count = e.target.dataset.charCount && document.getElementById(e.target.dataset.charCount);
      if (count) count.textContent = count.dataset.template.replace('[count]', e.target.value.length);
    });
    this.addEventListener('click', (e) => {
      const scrollTo = e.target.closest('[data-scroll-to]');
      if (scrollTo && scrollTo.hash) {
        const target = document.getElementById(scrollTo.hash.slice(1));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        }
      }
      const toggle = e.target.closest('.gift-recipient__toggle');
      if (toggle) {
        const check = toggle.querySelector('.gift-recipient__check');
        requestAnimationFrame(() => {
          check.checked = toggle.parentElement.open;
          this.onGiftToggle(check);
        });
      }
    });
    this.rememberViewed();
  }

  get state() {
    try {
      return JSON.parse(this.querySelector('[data-product-state]').textContent);
    } catch (_) {
      return {};
    }
  }

  enableInputs() {
    this.querySelectorAll('[data-js-enable]').forEach((el) => (el.disabled = false));
    const offset = this.querySelector('[data-gift-offset]');
    if (offset) offset.value = new Date().getTimezoneOffset();
  }

  initGuideLink() {
    const guide = this.querySelector('[data-product-guide][data-link-position="picker"]');
    this.querySelectorAll('[data-guide-link]').forEach((link) => {
      link.hidden = !guide;
      const label = link.querySelector('[data-guide-label]');
      if (guide && label && guide.dataset.label) label.textContent = guide.dataset.label;
    });
  }

  initFlash() {
    this.querySelectorAll('[data-flash]').forEach((flash) => {
      if (flash.hasAttribute('data-flash-over-media')) {
        const media = this.querySelector('.product__media');
        if (media && !media.contains(flash)) media.append(flash);
      }
      if (flash.dataset.close === 'auto') setTimeout(() => (flash.hidden = true), (Number(flash.dataset.duration) || 6) * 1000);
    });
  }

  selectedOptionValues(picker) {
    const ids = [];
    let complete = true;
    picker.querySelectorAll('fieldset, [data-option-select]').forEach((group) => {
      if (group.matches('select')) {
        if (group.value) ids.push(group.selectedOptions[0].dataset.optionValueId);
        else complete = false;
        return;
      }
      const checked = group.querySelector('input:checked');
      if (checked) ids.push(checked.dataset.optionValueId);
      else complete = false;
      const label = group.querySelector('[data-selected-value]');
      if (label && checked) label.textContent = checked.value;
    });
    return { ids, complete };
  }

  async onOptionChange(input) {
    const picker = input.closest('[data-variant-picker]');
    const { ids, complete } = this.selectedOptionValues(picker);
    if (!complete) return;
    const option = input.matches('select') ? input.selectedOptions[0] : input;
    const nextUrl = option.dataset.productUrl || this.productUrl;
    const focusId = input.id;
    this.controller?.abort();
    this.controller = new AbortController();
    this.setAttribute('aria-busy', 'true');
    try {
      const url = new URL(nextUrl, location.origin);
      url.searchParams.delete('variant');
      url.searchParams.set('section_id', this.sectionId);
      url.searchParams.set('option_values', ids.join(','));
      const res = await fetch(url, { signal: this.controller.signal });
      if (!res.ok) throw new Error(res.statusText);
      const doc = parseHTML(await res.text());
      const samePath = new URL(nextUrl, location.origin).pathname === new URL(this.productUrl, location.origin).pathname;
      if (!samePath) {
        // Combined listing: another product. Replace the whole section.
        const fresh = doc.querySelector('product-section');
        if (fresh) {
          this.replaceWith(fresh);
          scan(fresh);
          if (this.dataset.updateUrl !== 'false') history.replaceState(null, '', nextUrl);
          document.getElementById(focusId)?.focus();
          return;
        }
      }
      swapKeys(this, doc);
      this.afterSwap(focusId);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      this.removeAttribute('aria-busy');
    }
  }

  afterSwap(focusId) {
    const state = this.state;
    this.querySelectorAll('[data-variant-input]').forEach((el) => (el.value = state.variantId || ''));
    this.enableInputs();
    this.initGuideLink();
    this.initFlash();
    // Featured product sections live on other pages: they never change the page URL.
    if (this.dataset.updateUrl !== 'false') {
      const url = new URL(this.productUrl, location.origin);
      if (state.variantId) url.searchParams.set('variant', state.variantId);
      history.replaceState(null, '', url.pathname + url.search);
    }
    if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
    if (window.Shopify && window.Shopify.PaymentButton) window.Shopify.PaymentButton.init();
    const price = this.querySelector('.product-price .price__current');
    const button = this.querySelector('[data-add-label]');
    announce([price && price.textContent.trim(), button && button.textContent.trim()].filter(Boolean).join(', '));
    bus.emit('variant:change', { sectionId: this.sectionId, variantId: state.variantId, featuredMediaId: state.featuredMediaId, section: this });
  }

  /** Re-renders the section for the current variant (fresh in-cart counts and stock after adding). */
  async refresh() {
    try {
      const url = new URL(this.productUrl, location.origin);
      if (this.state.variantId) url.searchParams.set('variant', this.state.variantId);
      url.searchParams.set('section_id', this.sectionId);
      const res = await fetch(url);
      if (!res.ok) return;
      swapKeys(this, parseHTML(await res.text()));
      this.enableInputs();
    } catch (_) { /* keep the current view */ }
  }

  setButton(form, stateName) {
    const button = form.querySelector('[data-add-button]');
    const label = form.querySelector('[data-add-label]');
    if (!button || !label) return;
    if (!button.dataset.idleLabel) button.dataset.idleLabel = label.textContent.trim();
    if (stateName === 'adding') {
      button.setAttribute('aria-busy', 'true');
      label.textContent = button.dataset.labelAdding;
    } else if (stateName === 'added') {
      button.removeAttribute('aria-busy');
      label.textContent = button.dataset.labelAdded;
      setTimeout(() => (label.textContent = button.dataset.idleLabel), 1800);
    } else {
      button.removeAttribute('aria-busy');
      label.textContent = button.dataset.idleLabel;
    }
  }

  showError(form, message) {
    const box = form.querySelector('[data-form-error]');
    const text = form.querySelector('[data-form-error-text]');
    if (!box || !text) return;
    text.textContent = message || '';
    box.hidden = !message;
  }

  async onSubmit(e) {
    const form = e.target;
    const submitter = e.submitter;
    if (submitter && submitter.hasAttribute('formaction')) return; // Buy now goes to checkout natively.
    e.preventDefault();
    const button = form.querySelector('[data-add-button]');
    if (!button || button.disabled || button.getAttribute('aria-busy') === 'true') return;
    if (!form.reportValidity()) return;
    this.showError(form, '');
    this.setButton(form, 'adding');
    const data = new FormData(form);
    if (!data.get('id')) {
      this.setButton(form, 'idle');
      return;
    }
    try {
      const result = await cartRequest(W.routes.cartAdd + '.js', data);
      this.setButton(form, 'added');
      const cart = await getCart();
      bus.emit('cart:updated', { cart, count: cart.item_count });
      bus.emit('cart:added', { items: result.items || [result], source: this });
      announce((result.product_title || this.state.title || '') + ' ✓');
      if (this.state.wholesale) this.refresh();
      const after = W.settings.afterAdd;
      if (after === 'page') location.href = W.routes.cart;
      else if (after === 'drawer' && document.getElementById('CartDrawer')) openDialog('CartDrawer', button);
    } catch (err) {
      this.setButton(form, 'idle');
      this.showError(form, err.message);
    }
  }

  onGiftToggle(check) {
    const fields = this.querySelectorAll('.gift-recipient__fields input, .gift-recipient__fields textarea');
    fields.forEach((f) => {
      if (f.type === 'hidden') return;
      f.disabled = !check.checked;
    });
  }

  rememberViewed() {
    const handle = this.querySelector('template[data-recently-viewed-handle]');
    if (!handle) return;
    try {
      const key = 'weft:viewed';
      const list = JSON.parse(localStorage.getItem(key) || '[]').filter((h) => h !== handle.innerHTML.trim());
      list.unshift(handle.innerHTML.trim());
      localStorage.setItem(key, JSON.stringify(list.slice(0, 12)));
    } catch (_) { /* storage blocked */ }
  }
}

if (!customElements.get('product-section')) customElements.define('product-section', ProductSection);
