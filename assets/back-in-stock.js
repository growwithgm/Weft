/**
 * <back-in-stock>: submits the back-in-stock request without leaving the page. The core form is
 * Shopify's contact form, so the request works without JavaScript too (full page post). Store
 * builds can send it to a back-in-stock service (marked regions, removed from the Theme Store
 * package).
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
      /* integration:start */
      const service = this.querySelector('[data-bis-service]');
      if (service) {
        await this.sendToService(JSON.parse(service.textContent), form, chosen);
        this.done(form);
        return;
      }
      /* integration:end */
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'text/html' } });
      await res.text();
      if (res.ok && res.url.includes('contact_posted=true')) this.done(form);
      else this.message(form, window.Weft.strings.error, 'error');
    } catch (err) {
      this.message(form, (err && err.userMessage) || window.Weft.strings.error, 'error');
    } finally {
      button.removeAttribute('aria-busy');
    }
  }

  done(form) {
    form.querySelectorAll('.field, fieldset, label, button[type="submit"]').forEach((el) => (el.hidden = true));
    this.message(form, form.querySelector('[data-bis-success]')?.textContent.trim(), 'success');
  }

  /* integration:start */
  // Store builds: the request goes to a back-in-stock service as JSON.
  async sendToService(d, form, chosen) {
    const value = (name) => (form.querySelector(`[name="contact[${name}]"]`)?.value || '').trim();
    const res = await fetch(d.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: value('name'),
        phone: value('phone'),
        email: value('email'),
        hp: '',
        shop: d.shop,
        locale: d.locale,
        country_code: d.country,
        product_id: d.productId,
        product_title: d.productTitle,
        product_url: d.productUrl,
        variants: [...chosen].map((c) => ({ id: Number(c.dataset.variantId), title: c.dataset.variantTitle }))
      })
    });
    if (res.ok) return;
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || res.statusText);
    if (/phone/i.test(body.error || '')) err.userMessage = d.phoneError;
    throw err;
  }
  /* integration:end */
}

if (!customElements.get('back-in-stock')) customElements.define('back-in-stock', BackInStock);
