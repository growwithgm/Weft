// Reads Weft's section and block schemas and global settings, for the migration script and its
// tests. Values are checked the way the theme editor would accept them.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const schemaOf = (file) => {
  const m = readFileSync(file, 'utf8').match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  return m ? JSON.parse(m[1]) : null;
};
const byId = (settings = []) => Object.fromEntries(settings.filter((s) => s.id).map((s) => [s.id, s]));

export function loadThemeSchemas(root) {
  const sections = {};
  const blocks = {};
  for (const [dir, target] of [['sections', sections], ['blocks', blocks]]) {
    const path = join(root, dir);
    if (!existsSync(path)) continue;
    for (const f of readdirSync(path).filter((n) => n.endsWith('.liquid'))) {
      const schema = schemaOf(join(path, f));
      if (!schema) continue;
      target[basename(f, '.liquid')] = {
        schema,
        settings: byId(schema.settings),
        // Local blocks carry a name; references to theme blocks carry only a type.
        localBlocks: Object.fromEntries((schema.blocks || []).filter((b) => b.name && !b.type.startsWith('@')).map((b) => [b.type, byId(b.settings)])),
        refs: (schema.blocks || []).map((b) => b.type)
      };
    }
  }
  const global = {};
  const schemaFile = join(root, 'config/settings_schema.json');
  if (existsSync(schemaFile)) {
    for (const g of JSON.parse(readFileSync(schemaFile, 'utf8'))) for (const s of g.settings || []) if (s.id) global[s.id] = s;
  }
  return { sections, blocks, global };
}

/** Which block types a section or block accepts, and each one's settings. */
export function childTypes(themeSchemas, parent) {
  if (!parent) return { theme: false, app: false, named: new Map() };
  const named = new Map();
  let theme = false;
  let app = false;
  for (const type of parent.refs) {
    if (type === '@theme') theme = true;
    else if (type === '@app') app = true;
    else if (parent.localBlocks[type]) named.set(type, { local: true, settings: parent.localBlocks[type] });
    else if (themeSchemas.blocks[type]) named.set(type, { local: false, settings: themeSchemas.blocks[type].settings, schema: themeSchemas.blocks[type] });
  }
  return { theme, app, named };
}

/**
 * Checks a value against a setting definition. Returns { ok, value, note } where value may be
 * adjusted (range clamped to min/max and step), or ok:false with the reason.
 */
export function coerce(setting, value) {
  if (value === null || value === undefined) return { ok: false, note: 'empty value' };
  switch (setting.type) {
    case 'select':
    case 'radio': {
      const v = String(value);
      return setting.options.some((o) => o.value === v) ? { ok: true, value: v } : { ok: false, note: `"${v}" is not an option (${setting.options.map((o) => o.value).join(', ')})` };
    }
    case 'range': {
      const n = Number(value);
      if (!Number.isFinite(n)) return { ok: false, note: `"${value}" is not a number` };
      const step = setting.step || 1;
      let v = Math.min(setting.max, Math.max(setting.min, n));
      v = Math.round((v - setting.min) / step) * step + setting.min;
      v = Number(v.toFixed(4));
      return { ok: true, value: v, note: v !== n ? `${n} adjusted to ${v} (range ${setting.min}–${setting.max}, step ${step})` : undefined };
    }
    case 'number':
      return Number.isFinite(Number(value)) ? { ok: true, value: Number(value) } : { ok: false, note: `"${value}" is not a number` };
    case 'checkbox':
      return typeof value === 'boolean' ? { ok: true, value } : { ok: true, value: value === 'true' || value === true };
    case 'collection_list':
    case 'product_list':
    case 'metaobject_list':
      return Array.isArray(value) ? { ok: true, value } : { ok: false, note: 'expected a list' };
    case 'richtext': {
      // Shopify only accepts rich text wrapped in block tags.
      const v = String(value).trim();
      if (!v || v.startsWith('<')) return { ok: true, value: v };
      return { ok: true, value: `<p>${v}</p>`, note: 'plain text wrapped in a paragraph for a rich text setting' };
    }
    case 'inline_richtext': {
      // No block tags and no <br> in inline text (Shopify rejects the template): paragraphs,
      // headings and line breaks become spaces.
      const v = String(value).replace(/<\/(p|h[1-6]|div)>\s*<(p|h[1-6]|div)[^>]*>/g, ' ').replace(/<br\s*\/?>/gi, ' ').replace(/<\/?(p|h[1-6]|div)[^>]*>/g, '').replace(/\s{2,}/g, ' ').trim();
      return { ok: true, value: v, note: v !== String(value) ? 'block tags removed for an inline text setting' : undefined };
    }
    case 'text': {
      // A single paragraph from a live rich text field becomes plain text.
      const v = String(value);
      const m = v.trim().match(/^<p>([\s\S]*?)<\/p>$/);
      if (m && !/<\/?(p|h[1-6]|ul|ol|div)[\s>]/.test(m[1])) return { ok: true, value: m[1], note: 'paragraph tags removed for a plain text setting' };
      return { ok: true, value: v };
    }
    case 'color':
      return typeof value === 'string' && /^(#[0-9a-f]{3,8}|rgba?\(.+\)|)$/i.test(value.trim()) ? { ok: true, value } : { ok: false, note: `"${value}" is not a colour` };
    default:
      return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? { ok: true, value } : { ok: false, note: `unexpected ${typeof value}` };
  }
}
