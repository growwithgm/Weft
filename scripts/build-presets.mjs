#!/usr/bin/env node
// Writes the presets in config/settings_data.json from scripts/src/presets.mjs.
// `current` is only written when missing or with --reset, so theme-editor changes committed back
// by Shopify's GitHub integration are kept.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(ROOT, 'config/settings_data.json');
const presets = (await import(pathToFileURL(join(ROOT, 'scripts/src/presets.mjs')).href)).default;
const existing = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '')) : null;
const data = {
  current: existing && !process.argv.includes('--reset') ? existing.current : structuredClone(presets.Weft),
  presets
};
const out = JSON.stringify(data, null, 2) + '\n';
const prev = existsSync(file) ? readFileSync(file, 'utf8') : '';
if (process.argv.includes('--check')) {
  const expected = JSON.stringify(presets);
  const actual = existing ? JSON.stringify(existing.presets) : '';
  if (expected !== actual) {
    console.log('OUTDATED config/settings_data.json presets (run node scripts/build-presets.mjs)');
    process.exit(1);
  }
  process.exit(0);
}
// Shopify's GitHub sync keeps an "auto-generated" comment on top of the file; keep it too.
const header = prev ? (prev.match(/^\s*\/\*[\s\S]*?\*\/\s*\n/) || [''])[0] : '';
if (header + out !== prev) writeFileSync(file, header + out);
console.log('build-presets: settings_data.json up to date');
