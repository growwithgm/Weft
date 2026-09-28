#!/usr/bin/env node
// Migrates the live store's content and settings into store-configs/<store>/ (BUILD_SPEC §8.2).
//
// Reads reference/live-theme/: config/settings_data.json, every JSON template (context templates
// included) and every section group. Sections, blocks and settings are mapped through
// scripts/migration-map.json (kept in sync with docs/migration-map.md); the few cases a table
// can't express live in scripts/src/migration-handlers.mjs. Only content and settings move:
// no live code, CSS, JS or snippets are copied. Custom Liquid that merchants wrote (policy pages,
// about page, contact details) moves unchanged.
//
// Everything that doesn't carry over is reported in store-configs/<store>/migration-report.md
// (and .json): explained items carry the reason from the map, unexplained items mean the map
// needs work. Nothing is dropped silently.
//
// Usage: node scripts/migrate-from-live.mjs [--store ibban] [--live reference/live-theme] [--check]
//   --check  write nothing; exit 1 when there are unexplained items
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadThemeSchemas, childTypes, coerce } from './src/theme-schemas.mjs';
import handlers from './src/migration-handlers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const STORE = arg('--store', 'ibban');
const LIVE = join(ROOT, arg('--live', 'reference/live-theme'));
const OUT = join(ROOT, 'store-configs', STORE);
const CHECK = process.argv.includes('--check');

const readJSON = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
const walk = (dir) => (existsSync(dir) ? readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)])) : []);

export function createMigrator({ root = ROOT, map, schemas = loadThemeSchemas(root) }) {
  const report = [];
  const note = (entry) => report.push(entry);
  const schemeFor = (value) => (map.colorSchemes && map.colorSchemes[String(value)]) || value;
  // Live block id → the Weft block ids it became, per migrated section (context templates need it).
  const idMaps = new WeakMap();
  const ruleFor = (rules, b) => {
    const rule = rules[b.type];
    if (rule && rule.variants) return rule.variants.find((v) => !v.when || new RegExp(v.when.matches).test(String((b.settings || {})[v.when.setting] || ''))) || rule;
    return rule;
  };

  /** Maps one settings object. `rules` is the settings part of a section or block rule. */
  function settings(live = {}, defs = {}, rules = {}, where, file) {
    const out = {};
    for (const [key, raw] of Object.entries(live)) {
      if (raw === undefined || raw === null) continue;
      let rule = rules[key];
      if (rule === undefined && map.sharedSettings) rule = map.sharedSettings[key];
      if (rule && rule.drop) {
        note({ file, where, item: `setting ${key}`, action: 'dropped', reason: rule.drop, explained: true });
        continue;
      }
      const targets = typeof rule === 'string' ? [rule] : rule && rule.to ? [].concat(rule.to) : [key];
      for (const target of targets) {
        const def = defs[target];
        if (!def) {
          note({ file, where, item: `setting ${key}`, action: 'dropped', reason: rule ? `mapped to "${target}", which the Weft schema doesn't have` : 'no Weft setting with this id and no rule in the map', explained: false });
          continue;
        }
        let value = raw;
        if (rule && rule.values && Object.prototype.hasOwnProperty.call(rule.values, String(raw))) value = rule.values[String(raw)];
        if (def.type === 'color_scheme') value = schemeFor(value);
        if (value === '' && def.type !== 'text' && def.type !== 'textarea' && def.type !== 'richtext' && def.type !== 'html' && def.type !== 'liquid' && def.type !== 'inline_richtext' && def.type !== 'url') continue;
        const checked = coerce(def, value);
        if (!checked.ok) {
          note({ file, where, item: `setting ${key}`, action: 'dropped', reason: `value ${JSON.stringify(raw)}: ${checked.note}`, explained: Boolean(rule && rule.valuesExplained) });
          continue;
        }
        if (checked.note) note({ file, where, item: `setting ${key}`, action: 'changed', reason: checked.note, explained: true });
        out[target] = checked.value;
      }
    }
    for (const [target, value] of Object.entries(rules.$set || {})) if (out[target] === undefined && defs[target]) out[target] = value;
    return out;
  }

  /** Maps a block map + order under a Weft parent (section or block schema entry). */
  function blocks(liveBlocks = {}, liveOrder, parent, rules = {}, where, file) {
    const accepts = childTypes(schemas, parent);
    const outBlocks = {};
    const order = [];
    const idMap = {};
    const ids = [...new Set([...(liveOrder || []), ...Object.keys(liveBlocks)])];
    for (const id of ids) {
      const b = liveBlocks[id];
      if (!b) continue;
      const at = `${where} > block "${id}" (${b.type})`;
      if (b.type === '@app' || b.type.startsWith('shopify://apps/')) {
        if (accepts.app) {
          outBlocks[id] = b;
          idMap[id] = [id];
          if ((liveOrder || []).includes(id)) order.push(id);
        } else note({ file, where: at, item: 'app block', action: 'dropped', reason: 'the Weft section has no app block slot here', explained: false });
        continue;
      }
      const rule = ruleFor(rules, b);
      if (rule && rule.drop) {
        note({ file, where: at, item: 'block', action: 'dropped', reason: rule.drop, explained: true });
        continue;
      }
      const produced = rule && rule.handler ? handlers[rule.handler]({ id, block: b, rule, note: (e) => note({ file, where: at, ...e }) }) : [{ id, block: { ...b, type: (rule && rule.to) || b.type } }];
      for (const { id: newId, block } of produced) {
        const target = accepts.named.get(block.type) || (accepts.theme && !block.type.startsWith('_') && schemas.blocks[block.type] ? { settings: schemas.blocks[block.type].settings, schema: schemas.blocks[block.type] } : null);
        if (!target) {
          note({ file, where: at, item: 'block', action: 'dropped', reason: rule ? `mapped to "${block.type}", which this Weft section doesn't accept` : 'no rule in the map and no Weft block of this type here', explained: false });
          continue;
        }
        const out = { type: block.type };
        if (block.disabled) out.disabled = true;
        out.settings = settings(block.settings, target.settings, (rule && rule.settings) || {}, `${at} → ${block.type}`, file);
        if (block.blocks && target.schema) {
          const nested = blocks(block.blocks, block.block_order, target.schema, (rule && rule.blocks) || {}, `${at} → ${block.type}`, file);
          if (Object.keys(nested.blocks).length) {
            out.blocks = nested.blocks;
            out.block_order = nested.order;
          }
        } else if (block.blocks && Object.keys(block.blocks).length) {
          note({ file, where: at, item: 'nested blocks', action: 'dropped', reason: 'the Weft block takes no nested blocks', explained: Boolean(rule && rule.nestedExplained) });
        }
        outBlocks[newId] = out;
        (idMap[id] = idMap[id] || []).push(newId);
        if ((liveOrder || []).includes(id)) order.push(newId);
      }
    }
    return { blocks: outBlocks, order, idMap };
  }

  function section(id, s, file) {
    const where = `section "${id}" (${s.type})`;
    const rule = map.sections[s.type];
    if (!rule) {
      note({ file, where, item: 'section', action: 'dropped', reason: 'no rule in the map for this section type', explained: false });
      return null;
    }
    if (rule.drop) {
      note({ file, where, item: 'section', action: 'dropped', reason: rule.drop, explained: true });
      return null;
    }
    if (rule.handler) return handlers[rule.handler]({ id, section: s, rule, migrate: { settings, blocks, section }, schemas, note: (e) => note({ file, where, ...e }) });
    const target = rule.to || s.type;
    const weft = schemas.sections[target];
    if (!weft) {
      note({ file, where, item: 'section', action: 'dropped', reason: `mapped to "${target}", which doesn't exist in Weft`, explained: false });
      return null;
    }
    if (rule.note) note({ file, where, item: 'section', action: 'changed', reason: rule.note, explained: true });
    const out = { type: target };
    if (s.disabled) out.disabled = true;
    const b = blocks(s.blocks, s.block_order, weft, rule.blocks || {}, where, file);
    if (Object.keys(b.blocks).length) {
      out.blocks = b.blocks;
      out.block_order = b.order;
    }
    out.settings = settings(s.settings, weft.settings, rule.settings || {}, where, file);
    idMaps.set(out, b.idMap);
    return out;
  }

  /** A full template or section group. */
  function sectionsFile(data, file) {
    const out = { ...(data.type ? { type: data.type, name: data.name } : {}), sections: {}, order: [] };
    for (const id of [...new Set([...(data.order || []), ...Object.keys(data.sections || {})])]) {
      const s = data.sections[id];
      if (!s) continue;
      const migrated = section(id, s, file);
      if (!migrated) continue;
      out.sections[id] = migrated;
      if ((data.order || []).includes(id)) out.order.push(id);
    }
    return out;
  }

  /**
   * A context template ({ context, parent, sections }): only what differs from its base. Overrides
   * of base blocks follow the ids those blocks became; new blocks migrate like any other block.
   */
  function overlay(data, base, migratedBase, file) {
    const out = {};
    for (const key of ['context', 'parent', 'type', 'name']) if (data[key] !== undefined) out[key] = data[key];
    out.sections = {};
    if (data.order) out.order = data.order.filter((id) => migratedBase.sections[id]);
    for (const [id, s] of Object.entries(data.sections || {})) {
      const baseSection = base.sections[id];
      const where = `section "${id}"`;
      if (s.type) {
        const migrated = section(id, s, file);
        if (migrated) out.sections[id] = migrated;
        continue;
      }
      const migratedSection = migratedBase.sections[id];
      if (!baseSection || !migratedSection) {
        note({ file, where, item: 'override', action: 'dropped', reason: baseSection ? 'its base section does not carry over' : 'no section with this id in the base template', explained: Boolean(baseSection) });
        continue;
      }
      const rule = map.sections[baseSection.type] || {};
      const weft = schemas.sections[migratedSection.type];
      const ids = { ...(idMaps.get(migratedSection) || {}) };
      const o = {};
      if ('disabled' in s) o.disabled = s.disabled;
      if (s.settings && Object.keys(s.settings).length) {
        const { $set, ...srules } = rule.settings || {};
        o.settings = settings(s.settings, weft.settings, srules, `${where} (${baseSection.type})`, file);
      }
      if (s.blocks) {
        o.blocks = {};
        const typed = Object.fromEntries(Object.entries(s.blocks).filter(([, b]) => b.type));
        if (Object.keys(typed).length) {
          const added = blocks(typed, Object.keys(typed), weft, rule.blocks || {}, where, file);
          Object.assign(o.blocks, added.blocks);
          Object.assign(ids, added.idMap);
        }
        for (const [bid, b] of Object.entries(s.blocks)) {
          if (b.type) continue;
          const baseBlock = (baseSection.blocks || {})[bid];
          const targets = ids[bid] || [];
          if (!baseBlock || !targets.length) {
            note({ file, where: `${where} > block "${bid}"`, item: 'override', action: 'dropped', reason: baseBlock ? 'its base block does not carry over' : 'no block with this id in the base template', explained: Boolean(baseBlock) });
            continue;
          }
          for (const newId of targets) {
            const migratedBlock = (migratedSection.blocks || {})[newId];
            if (!migratedBlock) continue;
            const bo = {};
            if ('disabled' in b) bo.disabled = b.disabled;
            if (b.settings && Object.keys(b.settings).length) {
              const accepts = childTypes(schemas, weft);
              const target = accepts.named.get(migratedBlock.type) || { settings: (schemas.blocks[migratedBlock.type] || {}).settings || {} };
              const brule = ruleFor(rule.blocks || {}, baseBlock) || {};
              // Overrides carry only what the context changes, so fixed values ($set) stay in the base.
              const { $set, ...brules } = brule.settings || {};
              bo.settings = settings(b.settings, target.settings, brules, `${where} > block "${bid}"`, file);
            }
            o.blocks[newId] = bo;
          }
        }
      }
      if (s.block_order) o.block_order = s.block_order.flatMap((bid) => ids[bid] || []).filter((bid) => (migratedSection.blocks || {})[bid] || o.blocks[bid]);
      out.sections[id] = o;
    }
    return out;
  }

  function globals(live) {
    const g = map.globals;
    const current = {};
    const schemes = {};
    for (const [key, raw] of Object.entries(live)) {
      // App embeds, static sections and the old index list are handled by run().
      if (key === 'blocks' || key === 'sections' || key === 'content_for_index') continue;
      if (g.ignore && g.ignore[key]) {
        note({ file: 'config/settings_data.json', where: 'current', item: `setting ${key}`, action: 'dropped', reason: g.ignore[key], explained: true });
        continue;
      }
      // "bg_color": [["scheme-1", "background"]]: one live colour can fill several scheme roles.
      if (g.schemes && g.schemes[key]) {
        for (const [scheme, role] of g.schemes[key]) (schemes[scheme] = schemes[scheme] || {})[role] = raw;
        continue;
      }
      if (g.handlers && g.handlers[key]) {
        const produced = handlers[g.handlers[key]]({ key, value: raw, live, note: (e) => note({ file: 'config/settings_data.json', where: 'current', ...e }) });
        Object.assign(current, settings(produced, schemas.global, {}, 'current', 'config/settings_data.json'));
        continue;
      }
      Object.assign(current, settings({ [key]: raw }, schemas.global, g.settings, 'current', 'config/settings_data.json'));
    }
    return { current, schemes };
  }

  return { report, settings, blocks, section, sectionsFile, overlay, globals };
}

export async function run() {
  const map = readJSON(join(ROOT, 'scripts/migration-map.json'));
  const m = createMigrator({ map });
  const files = new Map();
  const liveData = readJSON(join(LIVE, 'config/settings_data.json'));

  // Global settings on top of the Weft preset, colour schemes role by role.
  const presets = (await import(pathToFileURL(join(ROOT, 'scripts/src/presets.mjs')).href)).default;
  const { current, schemes } = m.globals(liveData.current || {});
  const base = structuredClone(presets.Weft);
  for (const [scheme, roles] of Object.entries(schemes)) Object.assign(base.color_schemes[scheme].settings, roles);
  const settingsFile = 'config/settings_data.json';
  const appEmbeds = (liveData.current || {}).blocks || {};
  for (const [id, b] of Object.entries(appEmbeds)) {
    m.report.push({ file: settingsFile, where: `app embed "${id}"`, item: 'app embed', action: 'kept', reason: `${b.type.split('/blocks/')[0].replace('shopify://apps/', '')} app embed carried over${b.disabled ? ' (disabled, as in the live theme)' : ''}.`, explained: true });
  }
  files.set(settingsFile, { current: { ...base, ...current, ...(Object.keys(appEmbeds).length ? { blocks: appEmbeds } : {}) }, presets });

  // Templates and section groups. Context templates are overrides of their base file.
  const sources = [...walk(join(LIVE, 'templates')), ...walk(join(LIVE, 'sections')).filter((f) => f.endsWith('.json'))];
  const migratedBases = new Map();
  const liveBases = new Map();
  const order = sources.sort((a, b) => Number(a.includes('.context.')) - Number(b.includes('.context.')));
  for (const f of order) {
    const rel = relative(LIVE, f);
    const name = basename(f).replace(/\.(json|liquid)$/, '');
    const tpl = map.templates[rel.replace(/\.(json|liquid)$/, '')] || map.templates[name];
    if (tpl && tpl.drop) {
      m.report.push({ file: rel, where: 'file', item: 'template', action: 'dropped', reason: tpl.drop, explained: true });
      continue;
    }
    if (!f.endsWith('.json')) {
      m.report.push({ file: rel, where: 'file', item: 'template', action: 'dropped', reason: 'Liquid template with no rule in the map', explained: false });
      continue;
    }
    const data = readJSON(f);
    const outRel = (tpl && tpl.to) || rel;
    if (rel.includes('.context.')) {
      const baseRel = rel.replace(/\.context\.[^.]+\.json$/, '.json');
      if (!migratedBases.has(baseRel)) {
        m.report.push({ file: rel, where: 'file', item: 'context template', action: 'dropped', reason: `base ${baseRel} does not carry over`, explained: false });
        continue;
      }
      files.set(outRel, m.overlay(data, liveBases.get(baseRel), migratedBases.get(baseRel), rel));
    } else {
      const migrated = m.sectionsFile(data, rel);
      migratedBases.set(rel, migrated);
      liveBases.set(rel, data);
      files.set(outRel, migrated);
    }
  }

  // Store values that lived in live-theme code (delivery rules, installments, integrations).
  const store = map.storeSettings || { settings: {} };
  const storeValues = m.settings(store.settings, loadThemeSchemas(ROOT).global, {}, 'store settings', settingsFile);
  Object.assign(files.get(settingsFile).current, storeValues);
  for (const key of Object.keys(storeValues)) m.report.push({ file: settingsFile, where: 'current', item: `setting ${key}`, action: 'moved', reason: (store.sources || {})[key] || 'Store value from the live theme.', explained: true });

  // Approved decisions (brief §5) replace the live values they supersede.
  const approved = map.approved || {};
  for (const [scheme, roles] of Object.entries(approved.schemes || {})) {
    Object.assign(files.get(settingsFile).current.color_schemes[scheme].settings, roles);
    m.report.push({ file: settingsFile, where: `colour scheme ${scheme}`, item: Object.keys(roles).join(', '), action: 'changed', reason: approved.reasons[scheme] || approved.reasons.schemes, explained: true });
  }
  for (const [rel, data] of files) {
    if (!data.sections) continue;
    for (const [id, sec] of Object.entries(data.sections)) {
      const values = (approved.sections || {})[sec.type];
      if (!values || !sec.settings) continue;
      Object.assign(sec.settings, values);
      m.report.push({ file: rel, where: `section "${id}" (${sec.type})`, item: Object.keys(values).join(', '), action: 'changed', reason: approved.reasons[sec.type], explained: true });
    }
  }

  // Static sections kept in the live settings (the password page header) go to their template.
  for (const [id, sec] of Object.entries((liveData.current || {}).sections || {})) {
    const rule = map.staticSections && map.staticSections[sec.type];
    if (!rule || !files.has(rule.template)) {
      m.report.push({ file: settingsFile, where: `static section "${id}" (${sec.type})`, item: 'section', action: 'dropped', reason: 'no rule in the map for this static section', explained: false });
      continue;
    }
    const tpl = files.get(rule.template);
    const target = Object.values(tpl.sections).find((x) => x.type === rule.section);
    if (!target) {
      m.report.push({ file: settingsFile, where: `static section "${id}"`, item: 'section', action: 'dropped', reason: `${rule.template} has no ${rule.section} section`, explained: false });
      continue;
    }
    const schemas = loadThemeSchemas(ROOT);
    Object.assign(target.settings, m.settings(sec.settings, schemas.sections[rule.section].settings, rule.settings || {}, `static section "${id}" → ${rule.template}`, settingsFile));
    m.report.push({ file: settingsFile, where: `static section "${id}"`, item: 'section', action: 'moved', reason: `Settings moved to the ${rule.section} section in ${rule.template}.`, explained: true });
  }
  if ((liveData.current || {}).content_for_index) m.report.push({ file: settingsFile, where: 'current', item: 'content_for_index', action: 'dropped', reason: 'Old home page section list; the home page is templates/index.json.', explained: true });

  const unexplained = m.report.filter((r) => !r.explained);
  if (!CHECK) {
    for (const d of ['templates', 'sections', 'config']) rmSync(join(OUT, d), { recursive: true, force: true });
    for (const [rel, data] of files) {
      mkdirSync(dirname(join(OUT, rel)), { recursive: true });
      writeFileSync(join(OUT, rel), JSON.stringify(data, null, 2) + '\n');
    }
    writeFileSync(join(OUT, 'migration-report.json'), JSON.stringify(m.report, null, 2) + '\n');
    writeFileSync(join(OUT, 'migration-report.md'), renderReport(m.report, files.size));
  }
  const explained = m.report.length - unexplained.length;
  console.log(`migrate-from-live: ${files.size} files → store-configs/${STORE}/, ${explained} explained items, ${unexplained.length} unexplained`);
  if (CHECK && unexplained.length) process.exit(1);
}

function renderReport(report, fileCount) {
  const unexplained = report.filter((r) => !r.explained);
  const lines = [
    `# Migration report — store-configs/${STORE}`,
    '',
    `Generated by \`scripts/migrate-from-live.mjs\` from \`reference/live-theme/\`. ${fileCount} files written. ${report.length - unexplained.length} explained items, ${unexplained.length} unexplained.`,
    '',
    'Explained items carry the reason from `scripts/migration-map.json` (see `docs/migration-map.md`). Unexplained items mean the map needs a rule.',
    ''
  ];
  const group = (items) => {
    const byFile = new Map();
    for (const r of items) byFile.set(r.file, [...(byFile.get(r.file) || []), r]);
    for (const [file, rows] of [...byFile].sort()) {
      lines.push(`### ${file}`, '', '| Where | Item | Action | Reason |', '|---|---|---|---|');
      for (const r of rows) lines.push(`| ${r.where.replace(/\|/g, '\\|')} | ${r.item} | ${r.action} | ${String(r.reason).replace(/\|/g, '\\|').replace(/\n/g, ' ')} |`);
      lines.push('');
    }
  };
  lines.push('## Unexplained', '');
  if (unexplained.length) group(unexplained);
  else lines.push('None.', '');
  lines.push('## Explained', '');
  group(report.filter((r) => r.explained));
  return lines.join('\n');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await run();
