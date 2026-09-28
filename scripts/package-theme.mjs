#!/usr/bin/env node
// Builds the two Weft packages (BUILD_SPEC §8.1, architecture §10).
//
//   node scripts/package-theme.mjs --themestore
//     dist/themestore/ + dist/weft-themestore.zip: theme folders and listings/, with every
//     integration removed (integration-* files, marked integration regions, the Integrations
//     settings group and its values, integrations.* storefront strings), no config/markets.json
//     and no store configs. The default preset's listing is refreshed from the base templates.
//
//   node scripts/package-theme.mjs --store <name>
//     dist/<name>/ + dist/weft-<name>.zip: theme folders with integrations, plus
//     store-configs/<name>/ (templates, section groups, config, locales) laid over them; no
//     listings/. Push with `shopify theme push --path dist/<name> --unpublished`.
//
// Both builds are linted with scripts/theme-lint.mjs --root <build>; the Theme Store build also
// goes through `shopify theme package` when Shopify CLI is installed. Nothing is uploaded.
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { join, dirname, relative, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { stripRegions } from './src/integrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEME_DIRS = ['assets', 'blocks', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const TEXT = new Set(['.liquid', '.js', '.css', '.json', '.svg']);
const args = process.argv.slice(2);
const storeIndex = args.indexOf('--store');
const store = storeIndex >= 0 ? args[storeIndex + 1] : null;
const themestore = args.includes('--themestore');

if (!themestore && !store) {
  console.error('Usage: node scripts/package-theme.mjs --themestore | --store <name>');
  process.exit(2);
}
if (store && !/^[a-z0-9-]+$/.test(store)) {
  console.error(`Store name "${store}" must be lower case letters, digits and hyphens.`);
  process.exit(2);
}

const walk = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
};
const readJSON = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
const writeJSON = (file, data) => writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

const fresh = (dir) => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
};
const copyTheme = (out, extra = []) => {
  for (const d of [...THEME_DIRS, ...extra]) if (existsSync(join(ROOT, d))) cpSync(join(ROOT, d), join(out, d), { recursive: true });
};

const removeIntegrations = (out) => {
  const removed = [];
  for (const file of walk(out)) {
    if (basename(file).startsWith('integration-')) {
      rmSync(file);
      removed.push(relative(out, file));
      continue;
    }
    if (!TEXT.has(extname(file))) continue;
    const src = readFileSync(file, 'utf8');
    if (src.includes('integration:start')) writeFileSync(file, stripRegions(src));
  }
  // Settings: the Integrations group and its values.
  const schemaFile = join(out, 'config/settings_schema.json');
  const schema = readJSON(schemaFile).filter((g) => !(g.settings && g.settings.length && g.settings.filter((x) => x.id).every((x) => x.id.startsWith('integration_'))));
  writeJSON(schemaFile, schema);
  const dataFile = join(out, 'config/settings_data.json');
  const data = readJSON(dataFile);
  const clean = (o) => o && Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('integration_')));
  data.current = typeof data.current === 'object' ? clean(data.current) : data.current;
  for (const name of Object.keys(data.presets || {})) data.presets[name] = clean(data.presets[name]);
  writeJSON(dataFile, data);
  // Storefront strings used only by integrations.
  for (const file of walk(join(out, 'locales'))) {
    if (file.endsWith('.schema.json')) continue;
    const locale = readJSON(file);
    if (locale.integrations) {
      delete locale.integrations;
      writeJSON(file, locale);
    }
  }
  return removed;
};

// Any trace of an integration left in the Theme Store build fails the package.
const verifyClean = (out) => {
  const hits = [];
  for (const file of walk(out)) {
    if (!TEXT.has(extname(file))) continue;
    const src = readFileSync(file, 'utf8');
    for (const needle of ['integration-', 'integration_', 'integration:', 'integrations.', 'judgeme']) {
      if (src.includes(needle) && !(file.endsWith('.schema.json') && needle === 'integration_')) hits.push(`${relative(out, file)}: ${needle}`);
    }
  }
  return hits.filter((h) => !/locales\/[^/]+\.schema\.json/.test(h));
};

const lint = (out, extra = []) => {
  try {
    execFileSync(process.execPath, [join(ROOT, 'scripts/theme-lint.mjs'), '--root', out, ...extra], { stdio: 'inherit' });
  } catch (_) {
    console.error(`package-theme: lint failed for ${relative(ROOT, out)}`);
    process.exit(1);
  }
};

const zip = (out, file) => {
  rmSync(file, { force: true });
  execFileSync('zip', ['-qr', file, '.', '-x', '.*'], { cwd: out });
  console.log(`package-theme: ${relative(ROOT, file)} (${(statSync(file).size / 1024).toFixed(0)} KB)`);
};

const hasCli = () => {
  try {
    execFileSync('shopify', ['version'], { stdio: 'ignore' });
    return true;
  } catch (_) {
    return false;
  }
};

const dist = join(ROOT, 'dist');
mkdirSync(dist, { recursive: true });

if (themestore) {
  const out = join(dist, 'themestore');
  fresh(out);
  copyTheme(out, ['listings']);
  rmSync(join(out, 'config/markets.json'), { force: true });
  // The default preset's listing mirrors the base templates.
  const presets = Object.keys(readJSON(join(out, 'config/settings_data.json')).presets || {});
  const handle = (presets[0] || '').toLowerCase().replace(/ /g, '-');
  for (const file of walk(join(out, 'listings', handle, 'templates'))) {
    cpSync(join(out, 'templates', basename(file)), file);
  }
  const removed = removeIntegrations(out);
  const hits = verifyClean(out);
  if (hits.length) {
    console.error('package-theme: integration traces left in the Theme Store build:\n  ' + hits.join('\n  '));
    process.exit(1);
  }
  lint(out);
  zip(out, join(dist, 'weft-themestore.zip'));
  // Shopify's own packager validates theme_info, settings_schema.json and the presets.
  if (hasCli()) {
    execFileSync('shopify', ['theme', 'package', '--path', out], { stdio: 'inherit', cwd: dist });
  } else {
    console.log('package-theme: Shopify CLI not found, so `shopify theme package` was skipped (CI runs it)');
  }
  console.log(`package-theme: Theme Store build without ${removed.length} integration files; presets: ${presets.join(', ')}`);
}

if (store) {
  const out = join(dist, store);
  fresh(out);
  copyTheme(out);
  const config = join(ROOT, 'store-configs', store);
  if (existsSync(config)) {
    for (const d of ['templates', 'sections', 'config', 'locales']) {
      if (existsSync(join(config, d))) cpSync(join(config, d), join(out, d), { recursive: true });
    }
    console.log(`package-theme: store config store-configs/${store} applied`);
  } else {
    console.log(`package-theme: no store-configs/${store} yet, so the build uses the theme defaults`);
  }
  lint(out, ['--store-build']);
  zip(out, join(dist, `weft-${store}.zip`));
}
