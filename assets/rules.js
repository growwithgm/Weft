/**
 * Quantity rules and volume pricing helpers.
 *
 * Pure functions, no DOM. Numbers always come from Liquid (variant.quantity_rule,
 * variant.quantity_price_breaks, inventory) or from Shopify's Cart API. These helpers only
 * guide the buyer towards a quantity Shopify will accept; Shopify's response stays final.
 *
 * Shopify's validation (mirrored here): a line quantity is valid when it is 0, or when it is
 * at least `min`, at most `max` (if set), and a multiple of `increment`. When inventory is
 * tracked and overselling is off, the line also stays within available stock.
 *
 * "Line" below means the cart line total for one variant: what is already in the cart
 * (`inCart`) plus what the buyer is adding now.
 */

/** @typedef {{ min: number, max: number | null, increment: number }} Rule */
/** @typedef {{ minimum_quantity: number, price: number }} PriceBreak */

/**
 * Normalises a rule from Liquid JSON. Missing or broken values fall back to Shopify's
 * defaults (min 1, increment 1, no max).
 * @param {Partial<Rule> | null | undefined} raw
 * @returns {Rule}
 */
export function normalizeRule(raw) {
  const int = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
  };
  const increment = int(raw && raw.increment, 1);
  const min = int(raw && raw.min, 1);
  const max = raw && raw.max != null && raw.max !== '' ? int(raw.max, null) : null;
  return { min, max: max != null && max >= min ? max : null, increment };
}

/** True when the rule is Shopify's default (no chip is shown for it). */
export function isDefaultRule(rule) {
  const r = normalizeRule(rule);
  return r.min === 1 && r.increment === 1 && r.max == null;
}

/**
 * Highest line total the buyer may reach for a variant.
 * @param {Rule} rule
 * @param {{ tracked?: boolean, available?: number | null }} [stock]
 *   tracked: inventory is tracked AND overselling is off. available: inventory quantity.
 * @returns {number} Infinity when nothing caps the line.
 */
export function lineCap(rule, stock = {}) {
  const r = normalizeRule(rule);
  const byMax = r.max == null ? Infinity : r.max;
  const byStock = stock.tracked ? Math.max(0, Math.floor(Number(stock.available) || 0)) : Infinity;
  return Math.min(byMax, byStock);
}

/** Largest valid line total that doesn't pass `cap` (0 when none is valid). */
export function largestValid(rule, cap) {
  const r = normalizeRule(rule);
  if (!Number.isFinite(cap)) return Infinity;
  const top = Math.floor(cap / r.increment) * r.increment;
  return top >= r.min ? top : 0;
}

/**
 * Checks a line total against the rule and stock.
 * @param {number} total
 * @param {Rule} rule
 * @param {{ tracked?: boolean, available?: number | null }} [stock]
 * @returns {{ valid: boolean, issue: null | 'below_min' | 'not_multiple' | 'above_max' | 'above_stock',
 *            lower: number | null, upper: number | null }}
 *   lower / upper: the nearest valid totals below and above an invalid value (null when none).
 */
export function checkLine(total, rule, stock = {}) {
  const r = normalizeRule(rule);
  const q = Math.max(0, Math.floor(Number(total) || 0));
  const cap = lineCap(r, stock);
  const result = (issue) => {
    if (!issue) return { valid: true, issue: null, lower: null, upper: null };
    const down = Math.floor(q / r.increment) * r.increment;
    const up = Math.ceil(q / r.increment) * r.increment;
    const lowerCandidate = Math.min(down, largestValid(r, cap));
    const lower = lowerCandidate >= r.min && lowerCandidate < q ? lowerCandidate : null;
    let upper = Math.max(up, r.min);
    if (upper <= q) upper += r.increment;
    return { valid: false, issue, lower, upper: upper <= cap ? upper : null };
  };
  if (q === 0) return result(null);
  if (q < r.min) return result('below_min');
  if (q % r.increment !== 0) return result('not_multiple');
  if (r.max != null && q > r.max) return result('above_max');
  if (stock.tracked && q > cap) return result('above_stock');
  return result(null);
}

/**
 * Smallest amount the buyer can add to a line that already holds `inCart`.
 * With nothing in the cart this is the minimum; once the line is valid it is one increment.
 */
export function minimumToAdd(rule, inCart = 0) {
  const r = normalizeRule(rule);
  const held = Math.max(0, Math.floor(inCart));
  if (held >= r.min) return r.increment;
  const gap = r.min - held;
  return Math.ceil(gap / r.increment) * r.increment;
}

/**
 * Stepper "+" for an amount being added (inCart stays fixed). The first step jumps from 0 to
 * the minimum; an off-grid value snaps up to the next multiple.
 * @returns {number} the new amount, or the same amount when "+" is not possible.
 */
export function stepUp(amount, rule, { inCart = 0, cap = Infinity } = {}) {
  const r = normalizeRule(rule);
  const q = Math.max(0, Math.floor(amount));
  const room = cap - inCart;
  let next;
  if (q === 0) next = minimumToAdd(r, inCart);
  else if ((inCart + q) % r.increment !== 0) next = Math.ceil((inCart + q) / r.increment) * r.increment - inCart;
  else next = q + r.increment;
  return next <= room ? next : q;
}

/**
 * Stepper "−". From the minimum (or anything below it) it goes back to 0; an off-grid value
 * snaps down to the previous multiple.
 */
export function stepDown(amount, rule, { inCart = 0 } = {}) {
  const r = normalizeRule(rule);
  const q = Math.max(0, Math.floor(amount));
  if (q === 0) return 0;
  const total = inCart + q;
  let nextTotal = total % r.increment !== 0 ? Math.floor(total / r.increment) * r.increment : total - r.increment;
  if (nextTotal < r.min) nextTotal = inCart;
  return Math.max(0, nextTotal - inCart);
}

/** Whether "+" can move at all. */
export function canStepUp(amount, rule, options) {
  return stepUp(amount, rule, options) !== Math.max(0, Math.floor(amount));
}

/**
 * Commits a typed amount (on blur). Values below the minimum are kept so the UI can flag
 * them ("Below minimum"); off-grid values are rounded up to the next multiple, or down when
 * up would pass the cap.
 * @returns {{ value: number, note: null | 'rounded' | 'capped' }}
 */
export function commitTyped(typed, rule, { inCart = 0, cap = Infinity } = {}) {
  const r = normalizeRule(rule);
  const n = Math.max(0, Math.floor(Number(String(typed).replace(/\D/g, '')) || 0));
  if (n === 0) return { value: 0, note: null };
  const total = inCart + n;
  if (total < r.min) return { value: n, note: null };
  const rounded = total % r.increment ? Math.ceil(total / r.increment) * r.increment : total;
  if (rounded > cap) {
    const best = largestValid(r, cap);
    const value = Math.max(0, best - inCart);
    return { value, note: 'capped' };
  }
  return { value: rounded - inCart, note: rounded !== total ? 'rounded' : null };
}

/**
 * Price break that applies to a line total, or null for the base price.
 * @param {number} total
 * @param {PriceBreak[]} breaks
 */
export function activeBreak(total, breaks) {
  if (!Array.isArray(breaks) || total <= 0) return null;
  let hit = null;
  for (const b of breaks) {
    if (total >= b.minimum_quantity && (!hit || b.minimum_quantity > hit.minimum_quantity)) hit = b;
  }
  return hit;
}

/**
 * Per-piece price Shopify will apply at a line total (preview only; the cart is final).
 * @param {number} total
 * @param {number} basePrice in cents, from variant.price
 * @param {PriceBreak[]} breaks
 */
export function unitPriceAt(total, basePrice, breaks) {
  const b = activeBreak(total, breaks);
  return b ? b.price : basePrice;
}

/**
 * Rows for the volume pricing table. The first row starts at the rule minimum.
 * @returns {{ from: number, to: number | null, price: number }[]} empty when there are no breaks.
 */
export function tierRows(rule, basePrice, breaks) {
  const r = normalizeRule(rule);
  const sorted = (Array.isArray(breaks) ? breaks : [])
    .filter((b) => b && b.minimum_quantity > 0)
    .slice()
    .sort((a, b) => a.minimum_quantity - b.minimum_quantity);
  if (!sorted.length) return [];
  const rows = [];
  if (sorted[0].minimum_quantity > r.min) rows.push({ from: r.min, to: sorted[0].minimum_quantity - 1, price: basePrice });
  sorted.forEach((b, i) => {
    const next = sorted[i + 1];
    rows.push({ from: b.minimum_quantity, to: next ? next.minimum_quantity - 1 : null, price: b.price });
  });
  return rows;
}

/** Index of the tier row that contains `total` (-1 when none). */
export function activeRowIndex(rows, total) {
  if (!(total > 0)) return -1;
  return rows.findIndex((row) => total >= row.from && (row.to == null || total <= row.to));
}

/**
 * Stock hint for a wholesale cell (brief 7.10).
 * @returns {{ key: 'not_offered' | 'sold_out' | 'below_min' | 'available' | 'low' | 'in_stock', count: number | null }}
 */
export function stockHint(rule, { exists = true, tracked = false, available = null, lowThreshold = 10 } = {}) {
  const r = normalizeRule(rule);
  if (!exists) return { key: 'not_offered', count: null };
  if (!tracked) return { key: 'available', count: null };
  const qty = Math.max(0, Math.floor(Number(available) || 0));
  if (qty <= 0) return { key: 'sold_out', count: 0 };
  if (qty < r.min) return { key: 'below_min', count: qty };
  if (qty <= lowThreshold) return { key: 'low', count: qty };
  return { key: 'in_stock', count: qty };
}

/**
 * Summary for a set of matrix/quick-order lines.
 * @param {{ amount: number, inCart?: number, rule: Rule, stock?: object, basePrice: number, breaks?: PriceBreak[] }[]} lines
 * @returns {{ pieces: number, lines: number, invalid: number, subtotal: number }}
 *   subtotal: preview in cents built from each line's per-piece price at its line total.
 */
export function summarize(lines) {
  let pieces = 0;
  let count = 0;
  let invalid = 0;
  let subtotal = 0;
  for (const line of lines) {
    const amount = Math.max(0, Math.floor(line.amount || 0));
    if (!amount) continue;
    const inCart = line.inCart || 0;
    const check = checkLine(inCart + amount, line.rule, line.stock);
    pieces += amount;
    count += 1;
    if (!check.valid) invalid += 1;
    subtotal += amount * unitPriceAt(inCart + amount, line.basePrice, line.breaks);
  }
  return { pieces, lines: count, invalid, subtotal };
}
