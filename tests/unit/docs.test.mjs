import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Merchant documentation (docs/documentation/, BUILD_SPEC §8.4): brand-neutral, American English,
// Shopify's terms, and relative links that resolve.
const DIR = new URL('../../docs/documentation/', import.meta.url).pathname;
const pages = readdirSync(DIR).filter((f) => f.endsWith('.md'));

const RULES = [
  [/\b(ibban|judge\.?me|wasify|klaviyo|tag manager|clarity|grow ?nest)\b/i, 'pilot store and integration names stay out of the public documentation'],
  [/\b(colours?|coloured|catalogues?|centred?|centres|greys?|customis\w*|organis\w*|personalis\w*|favourites?|behaviours?|cancelled|licence)\b/i, 'American English'],
  [/&(?! Discovery)(?![a-z]+;)/, 'no ampersands (the Search & Discovery app name aside)'],
  // "Slider" stays for the before and after comparison slider; image carousels are slideshows.
  [/\b(homepage|(image|hero|banner|product) slider|sub-heading|sign-up|side bar|button name|shortcut icon)\b/i, "Shopify's terms (home page, slideshow, subheading, signup, sidebar, button label, favicon)"],
  [/lorem|ipsum/i, 'no placeholder text'],
  [/reference\/live-theme/, 'the licensed live theme is never referenced']
];

test('documentation has an index and the expected pages', () => {
  for (const f of ['index.md', 'getting-started.md', 'wholesale.md', 'hair-and-body-care.md', 'faq.md']) assert.ok(pages.includes(f), f);
});

test('documentation pages follow the text rules and link to existing pages', () => {
  const problems = [];
  for (const f of pages) {
    const src = readFileSync(join(DIR, f), 'utf8');
    const prose = src.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
    const h1 = src.match(/^# .+/gm) || [];
    if (h1.length !== 1) problems.push(`${f}: needs exactly one H1 (found ${h1.length})`);
    prose.split('\n').forEach((line, i) => {
      for (const [re, why] of RULES) if (re.test(line)) problems.push(`${f}:${i + 1}: ${why}: ${line.trim().slice(0, 80)}`);
    });
    for (const [, target] of src.matchAll(/\]\((?!https?:|mailto:|#)([^)#\s]+)(#[^)]*)?\)/g)) {
      if (!existsSync(join(DIR, target))) problems.push(`${f}: link to missing page ${target}`);
    }
  }
  assert.deepEqual(problems, []);
});
