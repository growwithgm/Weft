import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { createMigrator } from '../../scripts/migrate-from-live.mjs';
import { loadThemeSchemas, coerce } from '../../scripts/src/theme-schemas.mjs';
import { contrast } from './helpers/contrast.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const schemas = loadThemeSchemas(ROOT);

// A small map in the shape of scripts/migration-map.json.
const map = {
  colorSchemes: { none: 'scheme-1', 1: 'scheme-4' },
  sharedSettings: { heading_align: { to: 'heading_align', values: { 'text-center': 'center' } } },
  globals: { settings: { enable_quick_add: 'quick_add_enable', image_quality: { to: 'image_quality', values: { 1.25: 'high' } } }, ignore: { legacy: 'not used' }, schemes: { bg_color: [['scheme-1', 'background']] } },
  sections: {
    'image-banner': {
      settings: { url: 'link', prevent_animation: { drop: 'global setting in Weft' } },
      blocks: { heading: { to: 'heading' }, button: { handler: 'bannerButtons' } }
    },
    apps: {},
    'main-product': { blocks: { title: { to: 'product-title' }, 'custom-liquid': { handler: 'productLiquid' } } }
  },
  templates: {}
};

test('settings: renames, value maps, shared rules, colour schemes and explained drops', () => {
  const m = createMigrator({ root: ROOT, map, schemas });
  const out = m.section('hero', { type: 'image-banner', settings: { url: 'shopify://collections/sale', color_scheme: '1', prevent_animation: true, tint_opacity: 42, mystery: 1 } }, 'templates/index.json');
  assert.equal(out.type, 'image-banner');
  assert.equal(out.settings.link, 'shopify://collections/sale');
  assert.equal(out.settings.color_scheme, 'scheme-4');
  assert.equal(out.settings.tint_opacity, 40, 'range values snap to the Weft step');
  assert.ok(!('prevent_animation' in out.settings));
  const dropped = m.report.find((r) => r.item === 'setting prevent_animation');
  assert.equal(dropped.explained, true);
  assert.equal(dropped.reason, 'global setting in Weft');
  const unknown = m.report.find((r) => r.item === 'setting mystery');
  assert.equal(unknown.explained, false, 'a setting with no rule and no Weft twin is unexplained');
});

test('blocks: type renames, a handler that splits one block into two, app blocks kept where allowed', () => {
  const m = createMigrator({ root: ROOT, map, schemas });
  const out = m.section('hero', {
    type: 'image-banner',
    blocks: {
      h: { type: 'heading', settings: { heading: '<p>Summer</p>' } },
      b: { type: 'button', settings: { button_1_label: 'Shop', button_1_link: 'shopify://collections/all', button_1_style: 'btn btn--primary', button_2_label: 'Read', button_2_style: 'btn btn--secondary' } },
      a: { type: 'shopify://apps/forms/blocks/inline/1', settings: {} }
    },
    block_order: ['h', 'b', 'a'],
    settings: {}
  }, 'templates/index.json');
  assert.deepEqual(out.block_order, ['h', 'b', 'b-2', 'a']);
  assert.equal(out.blocks.h.settings.heading, 'Summer', 'inline rich text loses block tags');
  assert.deepEqual([out.blocks.b.settings.label, out.blocks['b-2'].settings.label, out.blocks['b-2'].settings.style], ['Shop', 'Read', 'secondary']);
  assert.equal(out.blocks.a.type, 'shopify://apps/forms/blocks/inline/1');
});

test('product Custom Liquid that rendered live snippets becomes first-class blocks', () => {
  const m = createMigrator({ root: ROOT, map, schemas });
  const out = m.section('main', {
    type: 'main-product',
    blocks: {
      t: { type: 'title', settings: {} },
      r: { type: 'custom-liquid', settings: { custom_liquid: "{%- unless customer.b2b? -%}{% render 'gn-rating' %}{%- endunless -%}" } },
      own: { type: 'custom-liquid', settings: { custom_liquid: '<p>Made in Madrid</p>' } }
    },
    block_order: ['t', 'r', 'own'],
    settings: {}
  }, 'templates/product.json');
  assert.equal(out.blocks.t.type, 'product-title');
  assert.equal(out.blocks.r.type, 'product-rating');
  assert.equal(out.blocks.r.settings.audience, 'retail');
  assert.equal(out.blocks.own.type, 'custom-liquid', 'merchant Custom Liquid stays as it is');
});

test('context templates keep context and parent, and follow the ids blocks became', () => {
  const m = createMigrator({ root: ROOT, map, schemas });
  const base = { sections: { hero: { type: 'image-banner', blocks: { b: { type: 'button', settings: { button_1_label: 'A', button_2_label: 'B' } } }, block_order: ['b'], settings: {} } }, order: ['hero'] };
  const migrated = m.sectionsFile(base, 'templates/index.json');
  const out = m.overlay({ context: { market: 'b2b' }, parent: 'index.json', sections: { hero: { block_order: ['b'], blocks: { b: { disabled: true } } } } }, base, migrated, 'templates/index.context.b2b.json');
  assert.deepEqual(out.context, { market: 'b2b' });
  assert.equal(out.parent, 'index.json');
  assert.deepEqual(out.sections.hero.block_order, ['b', 'b-2']);
  assert.equal(out.sections.hero.blocks['b-2'].disabled, true);
});

test('global settings: renames, value maps, scheme roles and ignored keys', () => {
  const m = createMigrator({ root: ROOT, map, schemas });
  const { current, schemes } = m.globals({ enable_quick_add: false, image_quality: '1.25', bg_color: '#fafafa', legacy: 'x' });
  assert.equal(current.quick_add_enable, false);
  assert.equal(current.image_quality, 'high');
  assert.equal(schemes['scheme-1'].background, '#fafafa');
  assert.equal(m.report.find((r) => r.item === 'setting legacy').explained, true);
});

test('coerce keeps values valid for their setting type', () => {
  assert.equal(coerce({ type: 'richtext' }, 'Hello').value, '<p>Hello</p>');
  assert.equal(coerce({ type: 'text' }, '<p>Hi</p>').value, 'Hi');
  assert.equal(coerce({ type: 'select', options: [{ value: 'a' }] }, 'b').ok, false);
  assert.equal(coerce({ type: 'range', min: 0, max: 30, step: 5 }, 33).value, 30);
});

test('the ibBan migration has no unexplained items and keeps every content value', { skip: !existsSync(join(ROOT, 'reference/live-theme/config/settings_data.json')) && 'live theme reference not present' }, () => {
  const out = execFileSync(process.execPath, [join(ROOT, 'scripts/migrate-from-live.mjs'), '--check'], { encoding: 'utf8' });
  assert.match(out, / 0 unexplained/);
  const [, found, total] = out.match(/content values (\d+)\/(\d+)/);
  assert.equal(found, total, 'every live content value is in the store config');
});

test('the ibBan store config keeps text readable in every colour scheme', { skip: !existsSync(join(ROOT, 'store-configs/ibban/config/settings_data.json')) && 'no store config yet' }, () => {
  const { current } = JSON.parse(readFileSync(join(ROOT, 'store-configs/ibban/config/settings_data.json'), 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
  const failures = [];
  for (const [id, { settings: c }] of Object.entries(current.color_schemes)) {
    for (const [label, fg, bg] of [['text', c.text, c.background], ['heading', c.heading, c.background], ['button', c.button_text, c.button_bg], ['secondary button', c.button_secondary_text, c.button_secondary_bg]]) {
      const ratio = contrast(fg, bg);
      if (ratio < 4.5) failures.push(`${id} ${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}`);
    }
  }
  assert.deepEqual(failures, []);
});
