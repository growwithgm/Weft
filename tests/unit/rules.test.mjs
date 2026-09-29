import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeRule, isDefaultRule, lineCap, checkLine, minimumToAdd, stepUp, stepDown, canStepUp,
  commitTyped, activeBreak, unitPriceAt, tierRows, activeRowIndex, stockHint, summarize, largestValid
} from '../../assets/rules.js';

// Sample data from brief §9.
const leila = { min: 4, increment: 2, max: 60 };
const zahra = { min: 6, increment: 6, max: null };
const nour = { min: 3, increment: 3, max: null };
const leilaBreaks = [{ minimum_quantity: 24, price: 2990 }, { minimum_quantity: 48, price: 2850 }];
const zahraBreaks = [{ minimum_quantity: 72, price: 3050 }, { minimum_quantity: 36, price: 3200 }];

test('normalizeRule falls back to Shopify defaults', () => {
  assert.deepEqual(normalizeRule(null), { min: 1, max: null, increment: 1 });
  assert.deepEqual(normalizeRule({ min: '4', increment: '2', max: '60' }), leila.max ? { min: 4, max: 60, increment: 2 } : null);
  assert.deepEqual(normalizeRule({ min: 0, increment: -3, max: '' }), { min: 1, max: null, increment: 1 });
  assert.equal(normalizeRule({ min: 10, max: 5 }).max, null, 'max below min is ignored');
  assert.ok(isDefaultRule({}));
  assert.ok(!isDefaultRule(nour));
});

test('lineCap uses the lower of max and tracked stock', () => {
  assert.equal(lineCap(leila, { tracked: true, available: 18 }), 18);
  assert.equal(lineCap(leila, { tracked: true, available: 90 }), 60);
  assert.equal(lineCap(leila, { tracked: false, available: 0 }), 60, 'untracked or oversell: no stock cap');
  assert.equal(lineCap(zahra, {}), Infinity);
  assert.equal(largestValid(leila, 7), 6);
  assert.equal(largestValid(zahra, 5), 0);
});

test('checkLine mirrors Shopify validation', () => {
  assert.equal(checkLine(0, leila).valid, true, '0 is always valid');
  assert.deepEqual(checkLine(2, leila), { valid: false, issue: 'below_min', lower: null, upper: 4 });
  assert.deepEqual(checkLine(40, zahra), { valid: false, issue: 'not_multiple', lower: 36, upper: 42 }, 'brief §7.13 example');
  assert.deepEqual(checkLine(62, leila), { valid: false, issue: 'above_max', lower: 60, upper: null });
  assert.deepEqual(checkLine(20, leila, { tracked: true, available: 18 }), { valid: false, issue: 'above_stock', lower: 18, upper: null });
  assert.equal(checkLine(6, leila, { tracked: true, available: 6 }).valid, true);
  assert.equal(checkLine(7, { min: 1, increment: 1 }).valid, true);
});

test('minimumToAdd depends on what is already in the cart', () => {
  assert.equal(minimumToAdd(leila, 0), 4);
  assert.equal(minimumToAdd(leila, 4), 2, 'valid line: one increment');
  assert.equal(minimumToAdd(zahra, 36), 6);
  assert.equal(minimumToAdd({ min: 6, increment: 2 }, 2), 4);
});

test('stepUp: first plus jumps to the minimum, then by the increment, stops at the cap', () => {
  assert.equal(stepUp(0, leila), 4);
  assert.equal(stepUp(4, leila), 6);
  assert.equal(stepUp(5, leila), 6, 'off-grid snaps up');
  assert.equal(stepUp(58, leila, { cap: 60 }), 60);
  assert.equal(stepUp(60, leila, { cap: 60 }), 60, 'no move at max');
  assert.equal(stepUp(0, leila, { cap: 3 }), 0, 'stock below minimum: cannot start');
  assert.ok(!canStepUp(0, leila, { cap: 3 }));
  assert.equal(stepUp(0, zahra, { inCart: 36, cap: Infinity }), 6);
  assert.equal(stepUp(0, zahra, { inCart: 12, cap: 12 }), 0, 'nothing left after in-cart');
});

test('stepDown: from the minimum back to 0, off-grid snaps down', () => {
  assert.equal(stepDown(4, leila), 0);
  assert.equal(stepDown(6, leila), 4);
  assert.equal(stepDown(7, leila), 6);
  assert.equal(stepDown(3, leila), 0, 'below minimum goes to 0');
  assert.equal(stepDown(6, zahra, { inCart: 36 }), 0);
  assert.equal(stepDown(0, leila), 0);
});

test('commitTyped rounds to the pack size and respects caps', () => {
  assert.deepEqual(commitTyped('5', leila), { value: 6, note: 'rounded' }, 'Ecru L/XL rounded to 6');
  assert.deepEqual(commitTyped('3', leila), { value: 3, note: null }, 'below minimum is kept and flagged elsewhere');
  assert.deepEqual(commitTyped('0', leila), { value: 0, note: null });
  assert.deepEqual(commitTyped('abc', leila), { value: 0, note: null });
  assert.deepEqual(commitTyped('19', leila, { cap: 18 }), { value: 18, note: 'capped' });
  assert.deepEqual(commitTyped('7', leila, { cap: 6 }), { value: 6, note: 'capped' });
  assert.deepEqual(commitTyped('5', zahra, { cap: 5 }), { value: 5, note: null }, 'below min stays for the flag');
  assert.deepEqual(commitTyped('8', zahra, { cap: 5 }), { value: 0, note: 'capped' }, 'nothing valid fits');
  assert.deepEqual(commitTyped('4', zahra, { inCart: 36 }), { value: 6, note: 'rounded' });
  assert.deepEqual(commitTyped('12', leila), { value: 12, note: null });
});

test('tiers: active break, unit price and table rows', () => {
  assert.equal(activeBreak(23, leilaBreaks), null);
  assert.equal(activeBreak(24, leilaBreaks).price, 2990);
  assert.equal(activeBreak(80, zahraBreaks).price, 3050, 'unsorted input');
  assert.equal(unitPriceAt(36, 3400, zahraBreaks), 3200);
  assert.equal(unitPriceAt(6, 3400, zahraBreaks), 3400);
  assert.equal(unitPriceAt(0, 3400, []), 3400);
  const rows = tierRows(leila, 3150, leilaBreaks);
  assert.deepEqual(rows, [
    { from: 4, to: 23, price: 3150 },
    { from: 24, to: 47, price: 2990 },
    { from: 48, to: null, price: 2850 }
  ]);
  assert.deepEqual(tierRows(nour, 2200, []), [], 'no tiers: component not rendered');
  assert.equal(activeRowIndex(rows, 30), 1);
  assert.equal(activeRowIndex(rows, 0), -1);
  assert.equal(activeRowIndex(rows, 100), 2);
});

test('stockHint covers every matrix cell state', () => {
  assert.deepEqual(stockHint(leila, { exists: false }), { key: 'not_offered', count: null });
  assert.deepEqual(stockHint(leila, { tracked: false }), { key: 'available', count: null });
  assert.deepEqual(stockHint(leila, { tracked: true, available: 0 }), { key: 'sold_out', count: 0 });
  assert.deepEqual(stockHint(leila, { tracked: true, available: 3 }), { key: 'below_min', count: 3 });
  assert.deepEqual(stockHint(leila, { tracked: true, available: 6 }), { key: 'low', count: 6 });
  assert.deepEqual(stockHint(leila, { tracked: true, available: 42 }), { key: 'in_stock', count: 42 });
});

test('summarize counts pieces, lines, invalid lines and a tier-aware subtotal', () => {
  const s = summarize([
    { amount: 6, rule: leila, basePrice: 3150, breaks: leilaBreaks },
    { amount: 4, rule: leila, basePrice: 3150, breaks: leilaBreaks },
    { amount: 0, rule: leila, basePrice: 3150, breaks: leilaBreaks },
    { amount: 2, rule: leila, basePrice: 3150, breaks: leilaBreaks }
  ]);
  assert.deepEqual(s, { pieces: 12, lines: 3, invalid: 1, subtotal: 12 * 3150 });
  const t = summarize([{ amount: 36, rule: zahra, basePrice: 3400, breaks: zahraBreaks }]);
  assert.equal(t.subtotal, 36 * 3200, 'brief §9 wholesale cart: Zahra Coral 36 × €32.00');
});
