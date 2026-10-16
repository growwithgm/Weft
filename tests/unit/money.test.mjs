import { test } from 'node:test';
import assert from 'node:assert/strict';

// core.js touches window/document at import time, so load its formatMoney through a small shim.
globalThis.window = { Weft: {}, requestIdleCallback: null };
globalThis.document = { addEventListener() {}, querySelectorAll: () => [], querySelector: () => null, documentElement: {}, body: { dataset: {} } };
globalThis.matchMedia = () => ({ matches: false });
globalThis.CustomEvent = class extends Event { constructor(n, o) { super(n); this.detail = o && o.detail; } };
globalThis.localStorage = { getItem: () => null, setItem() {} };
globalThis.sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.location = { pathname: '/', search: '', host: 'x', href: 'https://x/' };
const { formatMoney } = await import('../../assets/core.js');

test('formatMoney follows Shopify money formats', () => {
  assert.equal(formatMoney(3150, '€{{amount_with_comma_separator}}'), '€31,50');
  assert.equal(formatMoney(146700, '€{{amount_with_comma_separator}}'), '€1.467,00');
  assert.equal(formatMoney(8995, '${{amount}}'), '$89.95');
  assert.equal(formatMoney(123456789, '{{amount}} USD'), '1,234,567.89 USD');
  assert.equal(formatMoney(2200, '£{{amount_no_decimals}}'), '£22');
  assert.equal(formatMoney(2250, "{{amount_with_apostrophe_separator}} CHF"), '22.50 CHF');
  assert.equal(formatMoney(100000, '<span class=money>€{{amount_with_space_separator}}</span>'), '€1 000,00');
});
