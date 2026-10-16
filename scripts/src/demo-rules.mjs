// Shared reading and checking of scripts/src/demo-catalog.mjs, for the demo content builder and its
// unit test. Variant arrays hold the option values first, then stock (null = not tracked), then,
// when the product has per-variant prices, the price and the unit price measure.

export const variantsOf = (product) => product.variants.map((row) => {
  const n = product.options.length;
  const [stock, price = product.price, unit = null] = row.slice(n);
  return { values: row.slice(0, n), stock, price, unit };
});

// Per-piece wholesale price of a variant: a per-variant override keyed by the first option value,
// else the product's wholesale price. Volume tiers apply to variants at the product's price only.
export const wholesaleOf = (product, variant) => {
  const w = product.wholesale;
  const own = w.perVariant?.[variant.values[0]];
  return { price: own ?? w.price, tiers: own == null ? (w.tiers || []) : [] };
};

const PREFIX = { weft: 'WF', tress: 'TR', balm: 'BM' };
const compact = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

export const skuOf = (preset, index, variant) => {
  const parts = variant.values.filter((v) => v !== 'Default Title').map(compact);
  return [`${PREFIX[preset]}${String(index + 1).padStart(2, '0')}`, ...parts].join('-');
};

const multiple = (n, step) => Number.isInteger(n) && n % step === 0;

// Every problem in one preset's catalog, as readable lines; an empty list means the catalog is valid.
export function catalogProblems(preset, catalog) {
  const problems = [];
  const handles = new Set();
  const skus = new Set();
  const defined = new Set(catalog.metafields.map((m) => m.key));

  catalog.products.forEach((p, index) => {
    const at = `${preset}/${p.handle}`;
    if (handles.has(p.handle)) problems.push(`${at}: duplicate handle`);
    handles.add(p.handle);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.handle)) problems.push(`${at}: handle must be lower case words joined by hyphens`);
    if (!p.description?.startsWith('<p>')) problems.push(`${at}: description must be HTML paragraphs`);
    if (/lorem|ipsum/i.test(JSON.stringify(p))) problems.push(`${at}: placeholder text`);

    for (const key of Object.keys(p.metafields || {})) {
      if (!defined.has(key)) problems.push(`${at}: metafield ${key} has no definition`);
    }

    const variants = variantsOf(p);
    const combos = new Set();
    for (const v of variants) {
      const name = v.values.join(' / ');
      if (v.values.length !== p.options.length || v.values.some((x) => typeof x !== 'string')) problems.push(`${at} ${name}: option values do not match the options`);
      if (combos.has(name)) problems.push(`${at} ${name}: duplicate variant`);
      combos.add(name);
      if (!(v.stock === null || (Number.isInteger(v.stock) && v.stock >= 0))) problems.push(`${at} ${name}: stock must be a whole number or null`);
      if (typeof v.price !== 'number' || v.price < 0) problems.push(`${at} ${name}: missing retail price`);
      const sku = skuOf(preset, index, v);
      if (skus.has(sku)) problems.push(`${at} ${name}: duplicate SKU ${sku}`);
      skus.add(sku);
    }
    if (variants.length > 100) problems.push(`${at}: more than 100 variants`);

    const w = p.wholesale;
    if (!w) {
      problems.push(`${at}: no wholesale price`);
      return;
    }
    const { min, increment, max } = w;
    if (!Number.isInteger(increment) || increment < 1) problems.push(`${at}: increment must be a whole number of at least 1`);
    if (!multiple(min, increment) || min < 1) problems.push(`${at}: minimum ${min} is not a multiple of the increment ${increment}`);
    if (max != null && (!multiple(max, increment) || max < min)) problems.push(`${at}: maximum ${max} must be a multiple of the increment ${increment} and at least the minimum`);
    for (const key of Object.keys(w.perVariant || {})) {
      if (!variants.some((v) => v.values[0] === key)) problems.push(`${at}: per-variant price for "${key}", which is not a first option value`);
    }
    let lastQty = min;
    let lastPrice = w.price;
    for (const [qty, price] of w.tiers || []) {
      if (!(qty > lastQty)) problems.push(`${at}: tier ${qty}+ must be above the minimum and the tier before it`);
      if (!multiple(qty, increment)) problems.push(`${at}: tier ${qty}+ is not a multiple of the increment ${increment}`);
      if (max != null && qty > max) problems.push(`${at}: tier ${qty}+ is above the maximum ${max}`);
      if (!(price < lastPrice)) problems.push(`${at}: tier ${qty}+ price ${price} must be below the price before it`);
      lastQty = qty;
      lastPrice = price;
    }
    if (w.only && !['catalog', 'tag'].includes(w.only)) problems.push(`${at}: wholesale-only mode must be "catalog" or "tag"`);
    if (w.only === 'tag' && !p.tags.includes('b2b')) problems.push(`${at}: tag-gated wholesale-only product needs the tag "b2b"`);
    if (!w.only) {
      for (const v of variants) {
        const { price } = wholesaleOf(p, v);
        if (!(price < v.price)) problems.push(`${at} ${v.values.join(' / ')}: wholesale price ${price} is not below the retail price ${v.price}`);
      }
    }
  });

  return problems;
}
