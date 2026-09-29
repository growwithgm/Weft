#!/usr/bin/env node
// Builds Weft's translation files.
//
// 1. Editor strings. `config/settings_schema.json` is generated from scripts/src/settings-schema.mjs,
//    and every {% schema %} in sections/ and blocks/ is scanned. Plain-English labels are replaced
//    with t: keys and written to locales/en.default.schema.json. Translations come from
//    scripts/i18n/<lang>-schema.json (English → language; es, de, fr, it, nl, pt-PT, ja); anything
//    missing is listed in scripts/i18n/<lang>-schema-missing.json and fails --check.
// 2. Storefront strings. scripts/src/strings.mjs holds every key with all eight languages and
//    writes locales/<lang>.json (en.default, es, de, fr, it, nl, pt-PT, ja).
//
// Usage: node scripts/build-locales.mjs          write files
//        node scripts/build-locales.mjs --check  exit 1 if a file would change or a translation is missing

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const changed = [];
const problems = [];

const write = (file, content) => {
  const prev = existsSync(file) ? readFileSync(file, 'utf8') : null;
  // Shopify's GitHub sync adds an "auto-generated" comment on top of locale files; keep it.
  const header = prev && file.endsWith('.json') && (prev.match(/^\s*\/\*[\s\S]*?\*\/\s*\n/) || [''])[0];
  if (header && !content.startsWith('/*')) content = header + content;
  if (prev === content) return;
  changed.push(file.replace(ROOT + '/', ''));
  if (!CHECK) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
};
const json = (data) => JSON.stringify(data, null, 2) + '\n';

// ---------- editor strings ----------
const existingSchema = existsSync(join(ROOT, 'locales/en.default.schema.json'))
  ? JSON.parse(readFileSync(join(ROOT, 'locales/en.default.schema.json'), 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''))
  : {};
const enSchema = {};
const valueByKey = new Map();
const keyByValue = new Map();

const getPath = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const setPath = (obj, key, value) => {
  const parts = key.split('.');
  let o = obj;
  for (const p of parts.slice(0, -1)) o = o[p] ??= {};
  o[parts.at(-1)] = value;
};
const slug = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48) || 'x';

// Short strings share one key per English text (labels.*); long strings get a scoped key.
const keyFor = (english, scope) => {
  if (keyByValue.has(english)) return keyByValue.get(english);
  const short = english.length <= 48;
  let base = short ? `labels.${slug(english)}` : `text.${scope}`;
  let key = base;
  let n = 2;
  while (valueByKey.has(key) && valueByKey.get(key) !== english) key = `${base}_${n++}`;
  valueByKey.set(key, english);
  keyByValue.set(english, key);
  setPath(enSchema, key, english);
  return key;
};
const useKey = (value, scope) => {
  if (typeof value !== 'string' || !value) return value;
  if (value.startsWith('t:')) {
    const key = value.slice(2);
    const english = getPath(existingSchema, key);
    if (typeof english === 'string') {
      valueByKey.set(key, english);
      if (!keyByValue.has(english)) keyByValue.set(english, key);
      setPath(enSchema, key, english);
    } else problems.push(`Unknown schema key ${value} (${scope})`);
    return value;
  }
  return `t:${keyFor(value, scope)}`;
};

const translateSettings = (settings, scope) => {
  for (const s of settings || []) {
    const id = s.id || slug(s.content || 'header');
    for (const field of ['label', 'info', 'placeholder', 'content']) if (s[field]) s[field] = useKey(s[field], `${scope}.${id}.${field}`);
    for (const o of s.options || []) if (o.label) o.label = useKey(o.label, `${scope}.${id}.options.${o.value}`);
    if (s.definition) translateSettings(s.definition, `${scope}.${id}`);
  }
};

const translateSchema = (schema, scope) => {
  if (schema.name) schema.name = useKey(schema.name, `${scope}.name`);
  if (schema.tag === undefined && schema.class === undefined) {
    /* nothing */
  }
  translateSettings(schema.settings, `${scope}.settings`);
  for (const b of schema.blocks || []) {
    if (b.name) b.name = useKey(b.name, `${scope}.blocks.${b.type}.name`);
    translateSettings(b.settings, `${scope}.blocks.${b.type}.settings`);
  }
  for (const [i, p] of (schema.presets || []).entries()) {
    if (p.name) p.name = useKey(p.name, `${scope}.presets.${i}.name`);
    if (p.category) p.category = useKey(p.category, `${scope}.presets.${i}.category`);
  }
  if (schema.default && schema.default.name) schema.default.name = useKey(schema.default.name, `${scope}.default.name`);
};

const settingsSource = (await import(pathToFileURL(join(ROOT, 'scripts/src/settings-schema.mjs')).href + `?t=${Date.now()}`)).default;
const settingsSchema = structuredClone(settingsSource);
for (const group of settingsSchema) {
  if (group.name === 'theme_info') continue;
  const scope = `settings_schema.${slug(group.name)}`;
  group.name = useKey(group.name, `${scope}.name`);
  translateSettings(group.settings, `${scope}.settings`);
}
write(join(ROOT, 'config/settings_schema.json'), json(settingsSchema));

const schemaRe = /(\{%-?\s*schema\s*-?%\})([\s\S]*?)(\{%-?\s*endschema\s*-?%\})/;
for (const dir of ['sections', 'blocks']) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) continue;
  for (const name of readdirSync(full).filter((f) => f.endsWith('.liquid')).sort()) {
    const file = join(full, name);
    const src = readFileSync(file, 'utf8');
    const m = src.match(schemaRe);
    if (!m) continue;
    let schema;
    try {
      schema = JSON.parse(m[2]);
    } catch (e) {
      problems.push(`${dir}/${name}: invalid schema JSON (${e.message})`);
      continue;
    }
    translateSchema(schema, `${dir}.${slug(basename(name, '.liquid'))}`);
    const next = src.replace(schemaRe, `$1\n${JSON.stringify(schema, null, 2)}\n$3`);
    write(file, next);
  }
}

// Section group names ("t:" in sections/*.json)
for (const name of existsSync(join(ROOT, 'sections')) ? readdirSync(join(ROOT, 'sections')).filter((f) => f.endsWith('.json')) : []) {
  const file = join(ROOT, 'sections', name);
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^(\s*\/\*[\s\S]*?\*\/\s*)?([\s\S]*)$/);
  const data = JSON.parse(m[2]);
  if (data.name) data.name = useKey(data.name, `section_groups.${slug(basename(name, '.json'))}`);
  write(file, (m[1] || '') + json(data));
}

const sortDeep = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? Object.fromEntries(Object.keys(o).sort().map((k) => [k, sortDeep(o[k])])) : o);
write(join(ROOT, 'locales/en.default.schema.json'), json(sortDeep(enSchema)));

// Editor translations: scripts/i18n/<lang>-schema.json maps each English label to the language.
// Every language is required: a missing label fails --check (and so i18n-check).
const SCHEMA_LANGS = ['es', 'de', 'fr', 'it', 'nl', 'pt-PT', 'ja'];
for (const lang of SCHEMA_LANGS) {
  const mapFile = join(ROOT, `scripts/i18n/${lang}-schema.json`);
  const map = existsSync(mapFile) ? JSON.parse(readFileSync(mapFile, 'utf8')) : {};
  const missing = [];
  const tree = structuredClone(enSchema);
  const translateTree = (o) => {
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string') {
        if (map[v] != null && map[v] !== '') o[k] = map[v];
        else missing.push(v);
      } else translateTree(v);
    }
  };
  translateTree(tree);
  write(join(ROOT, `locales/${lang}.schema.json`), json(sortDeep(tree)));
  const missingFile = join(ROOT, `scripts/i18n/${lang}-schema-missing.json`);
  const missingSorted = [...new Set(missing)].sort();
  if (!CHECK && missingSorted.length) writeFileSync(missingFile, json(Object.fromEntries(missingSorted.map((m) => [m, '']))));
  else if (!CHECK && existsSync(missingFile)) rmSync(missingFile);
  if (missingSorted.length) problems.push(`${missingSorted.length} editor strings have no ${lang} translation (see scripts/i18n/${lang}-schema-missing.json)`);
}

// ---------- storefront strings ----------
const LANGS = { en: 'en.default', es: 'es', de: 'de', fr: 'fr', it: 'it', nl: 'nl', pt: 'pt-PT', ja: 'ja' };
const stringsFile = join(ROOT, 'scripts/src/strings.mjs');
if (existsSync(stringsFile)) {
  const strings = (await import(pathToFileURL(stringsFile).href + `?t=${Date.now()}`)).default;
  for (const [lang, file] of Object.entries(LANGS)) {
    const out = {};
    for (const [key, values] of Object.entries(strings)) {
      const value = values[lang];
      if (value == null) {
        problems.push(`strings.mjs: "${key}" has no "${lang}" translation`);
        continue;
      }
      setPath(out, key, value);
    }
    write(join(ROOT, `locales/${file}.json`), json(sortDeep(out)));
  }
}

for (const p of problems) console.log(`WARNING ${p}`);
if (CHECK) {
  for (const f of changed) console.log(`OUTDATED ${f} (run node scripts/build-locales.mjs)`);
  process.exit(changed.length || problems.length ? 1 : 0);
}
console.log(`build-locales: ${changed.length} files written, ${problems.length} warnings`);
