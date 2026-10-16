/**
 * Cart page shipping estimate: POST prepare_shipping_rates, then poll async_shipping_rates until
 * Shopify returns the rates (documented Cart API). Prices are Shopify's, only formatted here.
 */
import { formatMoney } from '@weft/core';

const W = window.Weft;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

class ShippingCalculator extends HTMLElement {
  connectedCallback() {
    if (this.bound) return;
    this.bound = true;
    try {
      this.strings = JSON.parse(this.querySelector('[data-shipping-strings]').textContent);
    } catch (_) {
      this.strings = {};
    }
    this.country = this.querySelector('[data-shipping-country]');
    this.province = this.querySelector('[data-shipping-province]');
    this.provinceField = this.querySelector('[data-shipping-province-field]');
    this.zip = this.querySelector('[data-shipping-zip]');
    this.result = this.querySelector('[data-shipping-result]');
    const preset = this.dataset.defaultCountry;
    if (preset && [...this.country.options].some((o) => o.value === preset)) this.country.value = preset;
    this.country.addEventListener('change', () => this.fillProvinces());
    this.fillProvinces();
    this.querySelector('[data-shipping-submit]').addEventListener('click', () => this.calculate());
    this.zip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.calculate();
      }
    });
  }

  fillProvinces() {
    let provinces = [];
    try {
      provinces = JSON.parse(this.country.selectedOptions[0]?.dataset.provinces || '[]');
    } catch (_) { /* none */ }
    this.province.replaceChildren(...provinces.map(([value, label]) => new Option(label, value)));
    this.provinceField.hidden = provinces.length === 0;
  }

  async calculate() {
    const params = new URLSearchParams();
    params.set('shipping_address[country]', this.country.value);
    if (!this.provinceField.hidden) params.set('shipping_address[province]', this.province.value);
    params.set('shipping_address[zip]', this.zip.value.trim());
    const root = (W.routes.cart || '/cart').replace(/\/cart$/, '');
    this.result.textContent = this.strings.loading || '';
    try {
      const prep = await fetch(`${root}/cart/prepare_shipping_rates.json?${params}`, { method: 'POST' });
      if (!prep.ok) throw await this.errorFrom(prep);
      let data = null;
      for (let i = 0; i < 20 && !data; i++) {
        const res = await fetch(`${root}/cart/async_shipping_rates.json?${params}`);
        if (!res.ok) throw await this.errorFrom(res);
        data = await res.json();
        if (!data) await wait(500);
      }
      this.render(data ? data.shipping_rates || [] : []);
    } catch (err) {
      this.result.textContent = err.message || this.strings.error;
    }
  }

  async errorFrom(res) {
    const body = await res.json().catch(() => ({}));
    const messages = Object.entries(body || {}).map(([field, list]) => `${field}: ${[].concat(list).join(', ')}`);
    return new Error(messages.join(' · ') || this.strings.error);
  }

  render(rates) {
    if (!rates.length) {
      this.result.textContent = this.strings.none || '';
      return;
    }
    const s = this.strings;
    const heading = document.createElement('p');
    heading.textContent = (rates.length === 1 ? s.one : s.other || '').replace('__n__', rates.length);
    const list = document.createElement('ul');
    list.className = 'shipping-calc__rates';
    list.setAttribute('role', 'list');
    for (const rate of rates) {
      const li = document.createElement('li');
      const cents = Math.round(parseFloat(rate.price) * 100);
      const name = document.createElement('span');
      name.textContent = rate.presentment_name || rate.name;
      const price = document.createElement('span');
      price.className = 'tabular';
      price.textContent = cents === 0 ? s.free : formatMoney(cents);
      li.append(name, price);
      list.append(li);
    }
    this.result.replaceChildren(heading, list);
  }
}

if (!customElements.get('shipping-calculator')) customElements.define('shipping-calculator', ShippingCalculator);
