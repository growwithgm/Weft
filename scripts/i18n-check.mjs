#!/usr/bin/env node
// i18n check (BUILD_SPEC §7.1):
// - every storefront key in en.default.json exists in every other storefront locale (and back)
// - no hard-coded customer-facing text in Liquid output: text nodes and aria-label/placeholder/
//   title/alt attributes must come from `| t`, settings or objects.
// - locale files are in sync with scripts/src/strings.mjs and the schema sources (build-locales --check)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const flatten = (o, p = '', out = new Map()) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === 'object') flatten(v, key, out);
    else out.set(key, v);
  }
  return out;
};

// Locale parity
const dir = join(ROOT, 'locales');
const files = readdirSync(dir).filter((f) => f.endsWith('.json') && !f.endsWith('.schema.json'));
const base = flatten(JSON.parse(readFileSync(join(dir, 'en.default.json'), 'utf8')));
for (const f of files) {
  if (f === 'en.default.json') continue;
  const other = flatten(JSON.parse(readFileSync(join(dir, f), 'utf8')));
  for (const k of base.keys()) if (!other.has(k)) problems.push(`locales/${f}: missing "${k}"`);
  for (const k of other.keys()) if (!base.has(k)) problems.push(`locales/${f}: extra "${k}"`);
  for (const [k, v] of other) if (typeof v === 'string' && !v.trim()) problems.push(`locales/${f}: empty "${k}"`);
}

// Hard-coded text scan
const ALLOW = /^(&[a-z]+;|[\s\d.,:;/|·•×–—+\-−()%*#@©®™!?'"’“”…]+|×|x|X|✓)$/;
// Proper nouns that are never translated.
const PROPER = new Set(['Facebook', 'Pinterest', 'RSS', 'X', 'WhatsApp', 'Instagram', 'TikTok', 'YouTube', 'Shop Pay', 'Klarna']);
const scan = (file) => {
  let src = readFileSync(file, 'utf8');
  src = src
    .replace(/\{%-?\s*(schema|style|stylesheet|javascript|comment|raw|doc)\s*-?%\}[\s\S]*?\{%-?\s*end\1\s*-?%\}/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/\{%-?\s*liquid[\s\S]*?-?%\}/g, ' ')
    .replace(/\{%[\s\S]*?%\}/g, ' ')
    .replace(/\{\{[\s\S]*?\}\}/g, '')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  for (const m of src.matchAll(/\b(aria-label|placeholder|title|alt)="([^"]*)"/g)) {
    const v = m[2].trim();
    if (v && /[A-Za-z]{2,}/.test(v)) problems.push(`${relative(ROOT, file)}: hard-coded ${m[1]}="${v}"`);
  }
  const text = src.replace(/<[^>]+>/g, '\n');
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || ALLOW.test(t) || PROPER.has(t)) continue;
    if (/[A-Za-zÀ-ÿ]{2,}/.test(t)) problems.push(`${relative(ROOT, file)}: hard-coded text "${t.slice(0, 60)}"`);
  }
};
for (const d of ['layout', 'sections', 'blocks', 'snippets', 'templates']) {
  const p = join(ROOT, d);
  if (!existsSync(p)) continue;
  for (const f of readdirSync(p, { recursive: true })) if (String(f).endsWith('.liquid')) scan(join(p, String(f)));
}

// Storefront text and default content use American English: storefront strings, template and
// section group content (base and listings), and the defaults in section and block schemas. The
// option-name lists that match merchants' own option names (e.g. "Color,Colour,Couleur") are exempt.
const AMERICAN = /\b(colours?|coloured|centred?|centres|greys?|catalogues?|customis\w*|organis\w*|personalis\w*|moisturis\w*|favourites?|behaviours?|jewellery|dialogues?|cancelled)\b/i;
{
  const check = (where, value) => {
    if (typeof value === 'string' && AMERICAN.test(value) && !/Couleur/.test(value)) problems.push(`${where} (${value.slice(0, 60)}): use American English`);
  };
  for (const [key, value] of base) check(`locales/en.default.json: "${key}"`, value);
  const jsonFiles = [];
  for (const d of ['templates', 'sections', 'listings']) {
    const p = join(ROOT, d);
    if (!existsSync(p)) continue;
    for (const f of readdirSync(p, { recursive: true })) if (String(f).endsWith('.json')) jsonFiles.push(join(p, String(f)));
  }
  for (const file of jsonFiles) {
    const data = JSON.parse(readFileSync(file, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\//, ''));
    for (const [key, value] of flatten(data)) check(`${relative(ROOT, file)}: "${key}"`, value);
  }
  const defaults = (node, where) => {
    if (Array.isArray(node)) node.forEach((n) => defaults(n, where));
    else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k === 'default' || (k === 'settings' && v && !Array.isArray(v) && typeof v === 'object')) {
          if (typeof v === 'string') check(where, v);
          else for (const [, x] of flatten({ v })) check(where, x);
        } else defaults(v, where);
      }
    }
  };
  for (const d of ['sections', 'blocks']) {
    for (const f of readdirSync(join(ROOT, d))) {
      if (!f.endsWith('.liquid')) continue;
      const m = readFileSync(join(ROOT, d, f), 'utf8').match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
      if (m) defaults(JSON.parse(m[1]), `${d}/${f}: schema default`);
    }
  }
}

// Editor text follows the Theme Store text rules: American English, no ampersands (the Search &
// Discovery app's name aside), statements rather than questions, Shopify's terms, "64 x 64px" sizes.
{
  const schemaText = flatten(JSON.parse(readFileSync(join(dir, 'en.default.schema.json'), 'utf8')));
  const rules = [
    [AMERICAN, 'use American English'],
    [/&(?! Discovery)/, 'no ampersands'],
    [/\?\s*$/, 'use a statement, not a question'],
    [/\b(homepage|slider|sub-heading|sign-up|sign up|side bar|button name|shortcut icon|ajax)\b/i, "use Shopify's terms (home page, slideshow, subheading, signup, sidebar, button label, favicon, cart type)"],
    [/\d\s*[×x]\s*\d+\s+px|\d+\s*×\s*\d+/, 'write image sizes as "64 x 64px"']
  ];
  for (const [key, value] of schemaText) {
    if (typeof value !== 'string') continue;
    for (const [re, why] of rules) if (re.test(value)) problems.push(`locales/en.default.schema.json: "${key}" (${value.slice(0, 60)}): ${why}`);
  }
}

// Generated files in sync
try {
  execFileSync(process.execPath, [join(ROOT, 'scripts/build-locales.mjs'), '--check'], { stdio: 'pipe' });
} catch (e) {
  problems.push(...String(e.stdout || '').trim().split('\n').filter(Boolean));
}
try {
  execFileSync(process.execPath, [join(ROOT, 'scripts/build-presets.mjs'), '--check'], { stdio: 'pipe' });
} catch (e) {
  problems.push(...String(e.stdout || '').trim().split('\n').filter(Boolean));
}

for (const p of problems) console.log(`WARNING ${p}`);
console.log(`i18n-check: ${files.length} storefront locales, ${base.size} keys, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
