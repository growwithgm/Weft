/**
 * <back-in-stock>: submits the back-in-stock request without leaving the page. The core form is
 * Shopify's contact form, so the request works without JavaScript too (full page post).
 */
import { announce } from '@weft/core';

class BackInStock extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    this.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-bis-form]');
      if (form) this.onSubmit(e, form);
    });
  }

  message(form, text, type) {
    const error = form.querySelector('[data-bis-error]');
    const success = form.querySelector('[data-bis-success]');
    if (error) {
      error.hidden = type !== 'error';
      error.textContent = type === 'error' ? text : '';
    }
    if (success) success.hidden = type !== 'success';
    if (text) announce(text);
  }

  async onSubmit(e, form) {
    e.preventDefault();
    const chosen = form.querySelectorAll('[data-variant-id]:checked');
    const hasVariants = form.querySelectorAll('[data-variant-id]').length > 0;
    if (hasVariants && !chosen.length) {
      this.message(form, this.dataset.noneSelected || '', 'error');
      return;
    }
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    button.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'text/html' } });
      await res.text();
      if (res.ok && res.url.includes('contact_posted=true')) {
        form.querySelectorAll('.field, fieldset, label, button[type="submit"]').forEach((el) => (el.hidden = true));
        this.message(form, form.querySelector('[data-bis-success]')?.textContent.trim(), 'success');
      } else {
        this.message(form, window.Weft.strings.error, 'error');
      }
    } catch (_) {
      this.message(form, window.Weft.strings.error, 'error');
    } finally {
      button.removeAttribute('aria-busy');
    }
  }
}

if (!customElements.get('back-in-stock')) customElements.define('back-in-stock', BackInStock);
