#!/usr/bin/env node
// Merges a JSON file of new English → Spanish editor strings into scripts/i18n/es-schema.json.
// Usage: node scripts/i18n/merge-es.mjs path/to/additions.json
import { readFileSync, writeFileSync } from 'node:fs';
const file = new URL('./es-schema.json', import.meta.url);
const base = JSON.parse(readFileSync(file, 'utf8'));
const add = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const merged = { ...base, ...add };
const sorted = Object.fromEntries(Object.keys(merged).sort((a, b) => a.localeCompare(b, 'en')).map((k) => [k, merged[k]]));
writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n');
console.log(`es-schema.json: ${Object.keys(sorted).length} strings`);
