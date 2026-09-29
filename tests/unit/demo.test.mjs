import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import catalogs from '../../scripts/src/demo-catalog.mjs';
import content from '../../scripts/src/demo-pages.mjs';
import { variantsOf, catalogProblems } from '../../scripts/src/demo-rules.mjs';

// Demo content (P8, VERTICALS §5): the catalogs follow Shopify's wholesale validation, the generated
// files are in sync, the finders lead to filled collections, and the scenario tests' default handles
// exist in the demo stores.
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const find = (preset, handle) => catalogs[preset].products.find((p) => p.handle === handle);

for (const [preset, catalog] of Object.entries(catalogs)) {
  test(`${preset}: catalog follows the demo and wholesale rules`, () => {
    assert.deepEqual(catalogProblems(preset, catalog), []);
  });
}

test('demo-content/ is generated from the catalogs', () => {
  const out = execFileSync(process.execPath, [new URL('../../scripts/build-demo-content.mjs', import.meta.url).pathname, '--check'], { encoding: 'utf8' });
  assert.match(out, /0 problems/);
});

test('VERTICALS §5 products carry their variants, prices, rules and tiers', () => {
  // [preset, handle, variant count, first retail price, min, increment, tier quantities, wholesale-only]
  const spec = [
    ['weft', 'leila-embroidered-tunic', 11, 79.95, 4, 2, [24, 48], false],
    ['weft', 'zahra-embroidered-kaftan', 4, 89.95, 6, 6, [36, 72], false],
    ['weft', 'nour-embroidered-tote', 2, 59.95, 3, 3, [], false],
    ['tress', 'argan-repair-shampoo', 2, 14.95, 6, 6, [24, 48], false],
    ['tress', 'curl-defining-cream', 1, 18.5, 6, 6, [36], false],
    ['tress', 'bond-repair-mask', 2, 22, 6, 6, [], false],
    ['tress', 'back-bar-shampoo', 1, 95, 2, 2, [], true],
    ['tress', 'color-cream', 3, 9.9, 12, 12, [48], false],
    ['balm', 'whipped-shea-body-butter', 6, 19, 6, 6, [24], false],
    ['balm', 'coffee-body-scrub', 1, 16, 6, 6, [], false],
    ['balm', 'dry-body-oil', 1, 24, 6, 6, [36], false],
    ['balm', 'body-butter-tester', 3, 0, 1, 1, [], true],
    ['balm', 'ritual-gift-set', 1, 49, 3, 3, [], false]
  ];
  const wrong = [];
  for (const [preset, handle, count, price, min, increment, tiers, only] of spec) {
    const p = find(preset, handle);
    if (!p) { wrong.push(`${preset}/${handle}: missing`); continue; }
    const v = variantsOf(p);
    const got = [v.length, v[0].price, p.wholesale.min, p.wholesale.increment, (p.wholesale.tiers || []).map(([q]) => q), Boolean(p.wholesale.only)];
    const want = [count, price, min, increment, tiers, only];
    if (JSON.stringify(got) !== JSON.stringify(want)) wrong.push(`${preset}/${handle}: ${JSON.stringify(got)} != ${JSON.stringify(want)}`);
  }
  assert.deepEqual(wrong, []);
  assert.ok(find('tress', 'argan-repair-shampoo').sellingPlan && find('balm', 'whipped-shea-body-butter').sellingPlan, 'subscription products');
  assert.equal(find('balm', 'whipped-shea-body-butter').metafields['custom.pao_months'], '12');
  assert.ok(find('balm', 'dry-body-oil').metafields['custom.warnings'], 'warnings row');
  assert.ok(find('balm', 'ritual-gift-set').bundle, 'bundle');
  assert.ok(find('tress', 'color-cream').tags.includes('row'), 'color cream uses the order matrix');
});

test('finder answers in the Tress and Balm listings match the demo catalogs', () => {
  const missing = [];
  for (const preset of ['tress', 'balm']) {
    const catalog = catalogs[preset];
    const index = JSON.parse(read(`listings/${preset}/templates/index.json`));
    const finder = Object.values(index.sections).find((s) => s.type === 'guided-finder');
    const questions = Object.values(finder.blocks).map((b) => [b.settings.param, b.settings.answers.split('\n')]);
    // The demo page uses the same questions as the home page finder.
    assert.deepEqual(content[preset].finder.questions.map(([, param, answers]) => [param, answers]), questions, `${preset}: find-your-routine page questions`);
    for (const [param, answers] of questions) {
      for (const answer of answers) {
        const value = answer.split('=').pop().trim();
        const hit = catalog.products.some((p) => (param === 'filter.p.tag'
          ? p.tags.includes(value)
          : (p.hairType || p.skinType || '').split(', ').includes(value)));
        if (!hit) missing.push(`${preset}: ${param} = ${value} matches no product`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test('scenario tests default to products and pages that exist in the demo stores', () => {
  const products = new Map();
  for (const [preset, c] of Object.entries(catalogs)) for (const p of c.products) products.set(p.handle, { preset, p });
  const pages = new Set(Object.values(content).flatMap((c) => c.pages.map((pg) => pg.handle)));
  const unknown = [];
  const defaults = {};
  for (const spec of ['tests/e2e/p3-wholesale.spec.mjs', 'tests/e2e/p6-verticals.spec.mjs']) {
    for (const [, key, handle] of read(spec).matchAll(/(\w+): process\.env\.E2E_\w+ \|\| '([a-z0-9-]+)'/g)) {
      defaults[key] = handle;
      if (!products.has(handle) && !pages.has(handle)) unknown.push(`${spec}: ${key} = ${handle}`);
    }
  }
  assert.deepEqual(unknown, []);
  const p = (key) => products.get(defaults[key]).p;
  assert.ok(p('matrix').tags.includes('row') && p('matrix').options.length === 2, 'matrix product has the matrix tag and two options');
  assert.equal(p('oneSize').options.length, 1, 'one-size product has one option');
  assert.equal(p('tagOnly').wholesale.only, 'tag');
  assert.equal(p('excluded').wholesale.only, 'catalog');
  assert.ok(p('professional').wholesale.only, 'professional product is wholesale-only');
  assert.ok(p('hair').sellingPlan && variantsOf(p('hair')).every((v) => v.unit), 'hair product has a selling plan and unit prices');
});

test('Theme Store listing follows the listing rules and docs/theme-store-listing.md is in sync', () => {
  const out = execFileSync(process.execPath, [new URL('../../scripts/build-listing.mjs', import.meta.url).pathname, '--check'], { encoding: 'utf8' });
  assert.match(out, /0 problems/);
});
