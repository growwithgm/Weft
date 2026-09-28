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
    if (!t || ALLOW.test(t)) continue;
    if (/[A-Za-zÀ-ÿ]{2,}/.test(t)) problems.push(`${relative(ROOT, file)}: hard-coded text "${t.slice(0, 60)}"`);
  }
};
for (const d of ['layout', 'sections', 'blocks', 'snippets', 'templates']) {
  const p = join(ROOT, d);
  if (!existsSync(p)) continue;
  for (const f of readdirSync(p, { recursive: true })) if (String(f).endsWith('.liquid')) scan(join(p, String(f)));
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
