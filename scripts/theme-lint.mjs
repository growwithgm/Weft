#!/usr/bin/env node
// Weft theme lint: the local stand-in for Theme Check in sessions where Shopify CLI can't be
// installed. It covers the checks that catch real breakage: JSON validity, schema validity,
// translation keys, missing files, Liquid tag balance, forbidden tags, remote or
// parser-blocking scripts, brand strings and asset budgets. Real Theme Check still runs in CI.
//
// Usage: node scripts/theme-lint.mjs [--json]
// Exit code 1 when there is any error or warning (the project gate is 0 errors, 0 warnings).

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEME_DIRS = ['assets', 'blocks', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const problems = [];
const report = (level, file, message, line) =>
  problems.push({ level, file: relative(ROOT, file), line: line || null, message });

const read = (f) => readFileSync(f, 'utf8');
const list = (dir, ext) => {
  const out = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (!ext || name.endsWith(ext)) out.push(p);
    }
  };
  walk(dir);
  return out;
};
const lineOf = (src, index) => src.slice(0, index).split('\n').length;

// Shopify allows a leading /* */ comment in JSON templates and section groups.
const parseJSON = (file, src) => {
  try {
    return JSON.parse(src.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
  } catch (e) {
    report('error', file, `Invalid JSON: ${e.message}`);
    return null;
  }
};

const flatten = (obj, prefix = '', out = new Map()) => {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out.set(key, v);
  }
  return out;
};

const SETTING_TYPES = new Set(
  'checkbox number radio range select text textarea article article_list blog collection collection_list color color_background color_palette color_scheme color_scheme_group font_picker html image_picker inline_richtext link_list liquid metaobject metaobject_list page product product_list richtext text_alignment url video video_url header paragraph'.split(' ')
);
const RESOURCE_TYPES = new Set(['article', 'article_list', 'blog', 'collection', 'collection_list', 'metaobject', 'metaobject_list', 'page', 'product', 'product_list']);
const BLOCK_TAGS = new Set(['if', 'unless', 'for', 'case', 'capture', 'form', 'paginate', 'tablerow', 'comment', 'raw', 'schema', 'style', 'stylesheet', 'javascript', 'doc']);
const PLURAL_KEYS = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);
const BRAND_PATTERNS = [/\bib\s?ban\b/i, /boutique luna/i, /sparklayer/i, /\bbss\b/i, /madrid serrano/i, /valencia ruzafa/i, /wasify/i, /judge\.?me/i, /grow\s?nest/i];
const BRAND_ALLOWED = (file) => /(^|\/)integration-/.test(file) || file.endsWith('settings_schema.json') || file.endsWith('.schema.json');

// ---------- load locales ----------
const localeDir = join(ROOT, 'locales');
const storefrontLocales = list(localeDir, '.json').filter((f) => !f.endsWith('.schema.json'));
const schemaLocales = list(localeDir, '.schema.json');
const defaultLocaleFile = join(localeDir, 'en.default.json');
const defaultSchemaFile = join(localeDir, 'en.default.schema.json');
const storefrontKeys = existsSync(defaultLocaleFile) ? flatten(parseJSON(defaultLocaleFile, read(defaultLocaleFile))) : new Map();
const schemaKeys = existsSync(defaultSchemaFile) ? flatten(parseJSON(defaultSchemaFile, read(defaultSchemaFile))) : new Map();
const storefrontKeyExists = (key) => {
  if (storefrontKeys.has(key)) return true;
  for (const p of PLURAL_KEYS) if (storefrontKeys.has(`${key}.${p}`)) return true;
  return false;
};

// ---------- locale parity ----------
const localeParity = (files, defaultFile, keys) => {
  for (const f of files) {
    if (f === defaultFile) continue;
    const data = parseJSON(f, read(f));
    if (!data) continue;
    const other = flatten(data);
    for (const k of keys.keys()) if (!other.has(k)) report('warning', f, `Missing translation key "${k}"`);
    for (const k of other.keys()) if (!keys.has(k)) report('warning', f, `Key "${k}" is not in the default locale`);
  }
};
localeParity(storefrontLocales, defaultLocaleFile, storefrontKeys);
localeParity(schemaLocales, defaultSchemaFile, schemaKeys);

// ---------- files that exist ----------
const names = (dir, ext) => new Set(list(join(ROOT, dir), ext).map((f) => basename(f, ext)));
const snippets = names('snippets', '.liquid');
const blocks = names('blocks', '.liquid');
const sections = names('sections', '.liquid');
const sectionGroups = names('sections', '.json');
const assets = new Set(list(join(ROOT, 'assets')).map((f) => relative(join(ROOT, 'assets'), f)));
const usedSnippets = new Set();
const blockSchemas = new Map();
const sectionSchemas = new Map();

// ---------- schema checks ----------
const checkTKeys = (file, value, where) => {
  if (typeof value === 'string') {
    if (value.startsWith('t:') && !schemaKeys.has(value.slice(2))) report('error', file, `Missing schema translation "${value}" (${where})`);
  } else if (Array.isArray(value)) value.forEach((v, i) => checkTKeys(file, v, `${where}[${i}]`));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) checkTKeys(file, v, `${where}.${k}`);
};

const checkSettings = (file, settings, where) => {
  if (!settings) return;
  if (!Array.isArray(settings)) return report('error', file, `${where}: settings must be an array`);
  const ids = new Set();
  for (const s of settings) {
    if (!s || !s.type) {
      report('error', file, `${where}: setting without type`);
      continue;
    }
    if (!SETTING_TYPES.has(s.type)) report('error', file, `${where}: unknown setting type "${s.type}"`);
    if (s.type === 'header' || s.type === 'paragraph') {
      if (!s.content) report('error', file, `${where}: ${s.type} without content`);
      continue;
    }
    if (!s.id) report('error', file, `${where}: ${s.type} setting without id`);
    else if (ids.has(s.id)) report('error', file, `${where}: duplicate setting id "${s.id}"`);
    else ids.add(s.id);
    if (!['color_palette', 'color_scheme_group'].includes(s.type) && !s.label) report('error', file, `${where}: setting "${s.id}" has no label`);
    if ((s.type === 'select' || s.type === 'radio') && (!Array.isArray(s.options) || !s.options.length)) report('error', file, `${where}: "${s.id}" needs options`);
    if ((s.type === 'select' || s.type === 'radio') && s.default != null && Array.isArray(s.options) && !s.options.some((o) => o.value === s.default))
      report('error', file, `${where}: "${s.id}" default "${s.default}" is not an option`);
    if (s.type === 'range') {
      for (const k of ['min', 'max', 'step', 'default']) if (typeof s[k] !== 'number') report('error', file, `${where}: range "${s.id}" needs numeric ${k}`);
      if (typeof s.default === 'number' && (s.default < s.min || s.default > s.max)) report('error', file, `${where}: range "${s.id}" default out of bounds`);
      if (typeof s.step === 'number' && (s.max - s.min) / s.step > 101) report('error', file, `${where}: range "${s.id}" has more than 101 steps`);
      if (typeof s.default === 'number' && typeof s.step === 'number' && Math.abs(((s.default - s.min) / s.step) % 1) > 1e-9)
        report('error', file, `${where}: range "${s.id}" default is not on a step`);
    }
    if (s.visible_if && !/^\{\{.*\}\}$/.test(s.visible_if.trim())) report('error', file, `${where}: "${s.id}" visible_if must be a {{ }} expression`);
    // Theme Check's schema rejects visible_if on resource pickers (found on the first CI run)
    if (s.visible_if && RESOURCE_TYPES.has(s.type)) report('error', file, `${where}: visible_if is not allowed on ${s.type} settings`);
  }
  return ids;
};

const extractSchema = (file, src) => {
  const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    report('error', file, `Invalid schema JSON: ${e.message}`);
    return undefined;
  }
};

// ---------- Liquid checks ----------
const stripComments = (src) =>
  src
    .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\{%-?\s*doc\s*-?%\}[\s\S]*?\{%-?\s*enddoc\s*-?%\}/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\{%-?\s*#[\s\S]*?-?%\}/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\{%-?\s*raw\s*-?%\}[\s\S]*?\{%-?\s*endraw\s*-?%\}/g, (m) => m.replace(/[^\n]/g, ' '));

const tagTokens = (src) => {
  // Returns [{ name, index, markup }] for every tag, expanding {% liquid %} lines.
  const out = [];
  const re = /\{%-?\s*([\s\S]*?)\s*-?%\}/g;
  let m;
  while ((m = re.exec(src))) {
    const body = m[1];
    const name = (body.match(/^(\w+)/) || [])[1];
    if (!name) continue;
    if (name === 'liquid') {
      const lines = body.slice(6).split('\n');
      let offset = m.index;
      let inComment = false;
      for (const raw of lines) {
        const line = raw.trim();
        offset += raw.length + 1;
        const n = (line.match(/^(\w+)/) || [])[1];
        if (!n) continue;
        if (inComment) {
          if (n === 'endcomment') inComment = false;
          continue;
        }
        if (n === 'comment') {
          inComment = true;
          continue;
        }
        out.push({ name: n, index: offset, markup: line });
      }
    } else out.push({ name, index: m.index, markup: body });
  }
  return out;
};

const checkBalance = (file, src) => {
  const stack = [];
  for (const t of tagTokens(src)) {
    if (BLOCK_TAGS.has(t.name)) stack.push(t);
    else if (t.name.startsWith('end') && BLOCK_TAGS.has(t.name.slice(3))) {
      const open = stack.pop();
      if (!open) report('error', file, `Unexpected {% ${t.name} %}`, lineOf(src, t.index));
      else if (open.name !== t.name.slice(3)) report('error', file, `{% ${t.name} %} closes {% ${open.name} %} opened on line ${lineOf(src, open.index)}`, lineOf(src, t.index));
    }
  }
  for (const open of stack) report('error', file, `Unclosed {% ${open.name} %}`, lineOf(src, open.index));
};

const liquidFiles = [
  ...list(join(ROOT, 'layout'), '.liquid'),
  ...list(join(ROOT, 'sections'), '.liquid'),
  ...list(join(ROOT, 'blocks'), '.liquid'),
  ...list(join(ROOT, 'snippets'), '.liquid'),
  ...list(join(ROOT, 'templates'), '.liquid')
];

for (const file of liquidFiles) {
  const raw = read(file);
  const src = stripComments(raw);
  const rel = relative(ROOT, file);
  checkBalance(file, src);

  const schemaless = src.replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/, '');

  // Forbidden and deprecated
  for (const [re, msg] of [
    [/\{%-?\s*include\s/, 'Use {% render %}, not {% include %}'],
    [/\ball_products\b/, 'all_products is not allowed'],
    [/\|\s*img_url\b/, 'img_url is deprecated; use image_url'],
    [/\{%-?\s*javascript\s*-?%\}/, 'Use assets/*.js modules instead of {% javascript %}'],
    [/\{%-?\s*stylesheet\s*-?%\}/, 'Use assets/*.css instead of {% stylesheet %}'],
    [/customer\.tags/, 'Customer tags never decide wholesale (brief §2); use customer.b2b?'],
    [/data-spark|spark-product-price/i, 'SparkLayer leftovers are not allowed (brief §4.9)'],
    [/\balert\(/, 'Never use alert(); show messages inline']
  ]) {
    const hit = schemaless.search(re);
    if (hit >= 0) report('error', file, msg, lineOf(src, hit));
  }

  // Remote and parser-blocking scripts
  for (const m of schemaless.matchAll(/<script\b([^>]*)>/g)) {
    const attrs = m[1];
    const srcAttr = attrs.match(/\bsrc=["']([^"']+)["']/);
    if (srcAttr && /^(https?:)?\/\//.test(srcAttr[1]) && !/cdn\.shopify\.com/.test(srcAttr[1]))
      report('error', file, `Remote script ${srcAttr[1]} (scripts must be Shopify-hosted)`, lineOf(src, m.index));
    if (srcAttr && !/\b(defer|async)\b|type=["']module["']/.test(attrs)) report('error', file, 'Parser-blocking script: add defer or type="module"', lineOf(src, m.index));
  }
  for (const m of schemaless.matchAll(/<link\b[^>]*href=["']((?:https?:)?\/\/[^"']+)["'][^>]*>/g)) {
    if (!/cdn\.shopify\.com|fonts\.shopifycdn\.com/.test(m[1]) && /stylesheet/.test(m[0])) report('error', file, `Remote stylesheet ${m[1]}`, lineOf(src, m.index));
  }

  // render / section / content_for block references
  for (const m of tagTokens(schemaless)) {
    if (m.name === 'render') {
      const name = (m.markup.match(/^render\s+['"]([^'"]+)['"]/) || [])[1];
      if (name) {
        usedSnippets.add(name);
        if (!snippets.has(name)) report('error', file, `Missing snippet "${name}"`, lineOf(schemaless, m.index));
      }
    }
    if (m.name === 'section') {
      const name = (m.markup.match(/^section\s+['"]([^'"]+)['"]/) || [])[1];
      if (name && !sections.has(name)) report('error', file, `Missing section "${name}"`);
    }
    if (m.name === 'sections') {
      const name = (m.markup.match(/^sections\s+['"]([^'"]+)['"]/) || [])[1];
      if (name && !sectionGroups.has(name)) report('error', file, `Missing section group "${name}"`);
    }
    if (['if', 'elsif', 'unless'].includes(m.name)) {
      const cond = m.markup.replace(/^\w+\s*/, '').replace(/(['"])(?:(?!\1).)*\1/g, '""');
      if (cond.includes('|')) report('error', file, `Filters are not allowed in {% ${m.name} %} conditions; assign first`, lineOf(schemaless, m.index));
    }
    if (m.name === 'content_for') {
      const type = (m.markup.match(/type:\s*['"]([^'"]+)['"]/) || [])[1];
      if (/['"]block['"]/.test(m.markup)) {
        if (!type) report('error', file, 'content_for "block" needs a type', lineOf(schemaless, m.index));
        else if (!blocks.has(type)) report('error', file, `Missing block "${type}"`, lineOf(schemaless, m.index));
        if (!/\bid:\s*['"][^'"]+['"]/.test(m.markup)) report('error', file, 'Static block needs a literal id', lineOf(schemaless, m.index));
      }
    }
  }

  // Raw preload links: Theme Check (AssetPreload) wants the preload_tag filter
  for (const m of schemaless.matchAll(/<link\b[^>]*rel=["']preload["'][^>]*>/g)) report('error', file, 'Use the preload_tag filter instead of <link rel="preload">', lineOf(src, m.index));

  // UnusedAssign (Theme Check): a variable assigned or captured and never read in the same file
  {
    const code = schemaless.replace(/\{%-?\s*(?:raw)\s*-?%\}[\s\S]*?\{%-?\s*endraw\s*-?%\}/g, '');
    const declared = new Map();
    for (const m of code.matchAll(/(?:\{%-?\s*|^\s*)(assign|capture)\s+([A-Za-z_][\w-]*)/gm)) if (!declared.has(m[2])) declared.set(m[2], m.index);
    for (const [name, index] of declared) {
      const esc = name.replace(/[-]/g, '\\-');
      const uses = [...code.matchAll(new RegExp(`(?<![\\w.-])${esc}(?![\\w-])`, 'g'))].filter((u) => {
        const before = code.slice(Math.max(0, u.index - 12), u.index);
        return !/(assign|capture)\s+$/.test(before);
      });
      if (!uses.length) report('error', file, `Unused assign "${name}"`, lineOf(src, index));
    }
  }

  // `'key' | t: arg: value | money` applies the filter to the translation, not to the argument
  for (const m of schemaless.matchAll(/\{\{[^}]*?\|\s*t:[^}|]*\|\s*(money\w*|date|times|plus|minus|divided_by|round|default|weight_with_unit)\b[^}]*\}\}/g)) {
    report('error', file, 'Filter after `| t:` arguments applies to the translation; assign the argument first', lineOf(src, m.index));
  }

  // asset_url references
  for (const m of schemaless.matchAll(/['"]([^'"{}]+\.(?:js|css|svg|png|jpg|webp|woff2?))['"]\s*\|\s*asset_url/g)) {
    if (!assets.has(m[1])) report('error', file, `Missing asset "${m[1]}"`, lineOf(src, m.index));
  }

  // storefront translation keys
  for (const m of schemaless.matchAll(/['"]([a-z0-9_]+(?:\.[a-z0-9_]+)+)['"]\s*\|\s*t\b/g)) {
    if (!storefrontKeyExists(m[1])) report('error', file, `Missing translation "${m[1]}"`, lineOf(src, m.index));
  }

  // brand-neutral code
  if (!BRAND_ALLOWED(rel)) {
    for (const re of BRAND_PATTERNS) {
      const hit = schemaless.search(re);
      if (hit >= 0) report('error', file, `Brand string ${re} in theme code (brand-neutral rule)`, lineOf(src, hit));
    }
  }

  // schema
  const schema = extractSchema(file, raw);
  const kind = rel.split('/')[0];
  if (schema) {
    checkTKeys(file, schema, 'schema');
    checkSettings(file, schema.settings, 'schema');
    if (!schema.name) report('error', file, 'Schema needs a name');
    if (kind === 'blocks') blockSchemas.set(basename(file, '.liquid'), schema);
    if (kind === 'sections') sectionSchemas.set(basename(file, '.liquid'), schema);
    for (const b of schema.blocks || []) {
      if (!b.type) report('error', file, 'Block entry without type');
      else if (b.name) checkSettings(file, b.settings, `block "${b.type}"`);
      else if (!['@app', '@theme'].includes(b.type) && !blocks.has(b.type)) report('error', file, `Schema references missing block "${b.type}"`);
    }
    const hasLocal = (schema.blocks || []).some((b) => b.name);
    const hasTheme = (schema.blocks || []).some((b) => !b.name && b.type !== '@app');
    if (hasLocal && hasTheme) report('error', file, 'A schema cannot mix section-defined blocks and theme blocks');
    if (kind === 'blocks' && !basename(file).startsWith('_') && !(schema.presets || []).length)
      report('warning', file, 'Public theme block has no preset, so it will not appear in the block picker');
    if (kind === 'sections' && schema.presets && (schema.enabled_on || schema.disabled_on) && schema.enabled_on && schema.disabled_on)
      report('error', file, 'Use either enabled_on or disabled_on, not both');
  } else if (schema === null && (kind === 'blocks' || (kind === 'sections' && !/^(predictive-search|cart-count|pickup-availability|card-fragment|compare-column)$/.test(basename(file, '.liquid'))))) {
    report('warning', file, 'No {% schema %} tag');
  }
}

// ---------- JSON files ----------
const localBlockTypes = (sectionType) => new Set(((sectionSchemas.get(sectionType) || {}).blocks || []).filter((b) => b.name).map((b) => b.type));
const checkBlockTree = (file, sectionType, blockMap, order, where) => {
  if (!blockMap) return;
  const local = localBlockTypes(sectionType);
  for (const [id, b] of Object.entries(blockMap)) {
    if (!b.type) report('error', file, `${where}: block "${id}" has no type`);
    else if (b.type.startsWith('shopify://apps/')) continue;
    else if (!local.has(b.type) && !blocks.has(b.type)) report('error', file, `${where}: unknown block type "${b.type}"`);
    if (b.blocks) checkBlockTree(file, sectionType, b.blocks, b.block_order, `${where} > ${id}`);
  }
  for (const id of order || []) if (!blockMap[id]) report('error', file, `${where}: block_order lists missing block "${id}"`);
};
const checkSectionsJSON = (file, data) => {
  if (!data || !data.sections) return report('error', file, 'Template/section group needs "sections"');
  for (const [id, s] of Object.entries(data.sections)) {
    if (!s.type) report('error', file, `Section "${id}" has no type`);
    else if (!s.type.startsWith('shopify://apps/') && !sections.has(s.type) && s.type !== '_blocks') report('error', file, `Unknown section type "${s.type}"`);
    checkBlockTree(file, s.type, s.blocks, s.block_order, `section "${id}"`);
  }
  for (const id of data.order || []) if (!data.sections[id]) report('error', file, `order lists missing section "${id}"`);
  checkTKeys(file, data.name, 'name');
};

for (const file of [...list(join(ROOT, 'templates'), '.json'), ...list(join(ROOT, 'listings'), '.json')]) {
  const data = parseJSON(file, read(file));
  if (data) checkSectionsJSON(file, data);
}
for (const file of list(join(ROOT, 'sections'), '.json')) {
  const data = parseJSON(file, read(file));
  if (!data) continue;
  checkSectionsJSON(file, data);
  if (!data.type) report('error', file, 'Section group needs a "type" (header, footer, aside or custom.*)');
}

// ---------- config ----------
const schemaFile = join(ROOT, 'config', 'settings_schema.json');
const globalIds = new Set();
if (existsSync(schemaFile)) {
  const groups = parseJSON(schemaFile, read(schemaFile));
  if (groups) {
    if (!groups.some((g) => g.name === 'theme_info')) report('error', schemaFile, 'theme_info is missing');
    for (const g of groups) {
      if (g.name === 'theme_info') continue;
      checkTKeys(schemaFile, g, g.name);
      const ids = checkSettings(schemaFile, g.settings, `group ${g.name}`) || new Set();
      for (const id of ids) {
        if (globalIds.has(id)) report('error', schemaFile, `Duplicate global setting id "${id}"`);
        globalIds.add(id);
      }
    }
  }
} else report('error', schemaFile, 'config/settings_schema.json is missing');

const dataFile = join(ROOT, 'config', 'settings_data.json');
if (existsSync(dataFile)) {
  const data = parseJSON(dataFile, read(dataFile));
  if (data) {
    const check = (settings, where) => {
      if (!settings || typeof settings !== 'object') return;
      for (const k of Object.keys(settings)) {
        if (k === 'sections' || k === 'content_for_index' || k === 'blocks') continue;
        if (!globalIds.has(k)) report('warning', dataFile, `${where}: "${k}" is not a setting in settings_schema.json`);
      }
    };
    if (typeof data.current === 'object') check(data.current, 'current');
    for (const [name, preset] of Object.entries(data.presets || {})) check(preset, `preset ${name}`);
  }
} else report('error', dataFile, 'config/settings_data.json is missing');

// ---------- unused snippets ----------
for (const s of snippets) {
  if (usedSnippets.has(s)) continue;
  // Snippets may be rendered with a variable name; allow a marker comment "{%- comment -%}weft:dynamic{%- endcomment -%}".
  const src = read(join(ROOT, 'snippets', `${s}.liquid`));
  if (!src.includes('weft:dynamic')) report('warning', join(ROOT, 'snippets', `${s}.liquid`), 'Unused snippet');
}

// ---------- JS syntax and brand scan in assets ----------
for (const file of list(join(ROOT, 'assets'))) {
  const rel = relative(ROOT, file);
  if (/\.(js|css)$/.test(file)) {
    const src = read(file);
    if (!BRAND_ALLOWED(rel)) for (const re of BRAND_PATTERNS) if (re.test(src)) report('error', file, `Brand string ${re} in theme code`);
    if (file.endsWith('.js') && /\balert\(/.test(src)) report('error', file, 'Never use alert()');
    if (file.endsWith('.css') && /@import\b/.test(src)) report('error', file, 'No @import in CSS');
  }
}

// ---------- budgets (compressed bytes) ----------
const budgetFile = join(ROOT, 'tests', 'lighthouse', 'budgets.json');
if (existsSync(budgetFile)) {
  const budgets = JSON.parse(read(budgetFile));
  for (const [asset, max] of Object.entries(budgets.assets || {})) {
    const p = join(ROOT, 'assets', asset);
    if (!existsSync(p)) continue;
    const size = gzipSync(readFileSync(p)).length;
    if (size > max) report('error', p, `Over budget: ${size} B gzip > ${max} B`);
  }
}

// ---------- output ----------
const errors = problems.filter((p) => p.level === 'error');
const warnings = problems.filter((p) => p.level === 'warning');
if (process.argv.includes('--json')) console.log(JSON.stringify(problems, null, 2));
else {
  for (const p of problems) console.log(`${p.level === 'error' ? 'ERROR  ' : 'WARNING'} ${p.file}${p.line ? `:${p.line}` : ''}  ${p.message}`);
  const counted = THEME_DIRS.reduce((n, d) => n + list(join(ROOT, d)).length, 0);
  console.log(`\ntheme-lint: ${counted} theme files, ${errors.length} errors, ${warnings.length} warnings`);
}
process.exit(errors.length || warnings.length ? 1 : 0);
