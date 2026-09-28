import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import presets from '../../scripts/src/presets.mjs';
import { contrast } from './helpers/contrast.mjs';

// WCAG 2.2 contrast for every text pair each preset can put on screen. Settings a preset leaves out
// fall back to the schema defaults, as they do in the theme editor.
const schema = JSON.parse(readFileSync(new URL('../../config/settings_schema.json', import.meta.url), 'utf8'));
const defaults = Object.fromEntries(schema.flatMap((g) => g.settings || []).filter((s) => s.id && 'default' in s).map((s) => [s.id, s.default]));

const TEXT = 4.5;

for (const [name, preset] of Object.entries(presets)) {
  const s = { ...defaults, ...preset };

  test(`${name}: every colour scheme meets text contrast`, () => {
    const failures = [];
    for (const [id, { settings: c }] of Object.entries(preset.color_schemes)) {
      const pairs = {
        'text on background': [c.text, c.background],
        'heading on background': [c.heading, c.background],
        'secondary text on background': [c.muted, c.background],
        'link on background': [c.link, c.background],
        'text on surface': [c.text, c.surface],
        'secondary text on surface': [c.muted, c.surface],
        'button label': [c.button_text, c.button_bg],
        'button label on hover': [c.button_text, c.button_hover],
        'secondary button label': [c.button_secondary_text, c.button_secondary_bg]
      };
      for (const [label, [fg, bg]] of Object.entries(pairs)) {
        const ratio = contrast(fg, bg);
        if (ratio < TEXT) failures.push(`${id} ${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}`);
      }
    }
    assert.deepEqual(failures, []);
  });

  test(`${name}: labels, cards and messages meet text contrast`, () => {
    const page = preset.color_schemes['scheme-1'].settings.background;
    const pairs = {
      'sale price on the page': [s.color_sale, page],
      'sale label': [s.label_sale_text, s.label_sale_bg],
      'sold out label': [s.label_sold_out_text, s.label_sold_out_bg],
      'new label': [s.label_new_text, s.label_new_bg],
      'pre-order label': [s.label_preorder_text, s.label_preorder_bg],
      'custom label': [s.label_custom_text, s.label_custom_bg],
      'boxed card text': [s.card_text, s.card_bg],
      'highlighted card text': [s.card_highlight_text, s.card_highlight_bg],
      'collection card label': [s.collection_card_label_color, s.collection_card_bg],
      'success message': [s.color_success, s.color_success_bg],
      'error message': [s.color_error, s.color_error_bg],
      'info message': [s.color_info, s.color_info_bg],
      'in stock on the page': [s.color_stock_ok, page],
      'low stock on the page': [s.color_stock_low, page],
      'out of stock on the page': [s.color_stock_out, page]
    };
    const failures = Object.entries(pairs)
      .map(([label, [fg, bg]]) => [label, fg, bg, contrast(fg, bg)])
      .filter(([, , , ratio]) => ratio < TEXT)
      .map(([label, fg, bg, ratio]) => `${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}`);
    assert.deepEqual(failures, []);
  });
}
