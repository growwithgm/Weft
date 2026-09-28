#!/usr/bin/env node
// Component tests: load static HTML fixtures (mirroring the Liquid output) in Chromium and
// exercise the theme's JavaScript. Runs in cloud sessions (pre-installed Chromium) and in CI.
// Usage: node tests/components/run.mjs [filter]
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
let playwright;
try {
  playwright = await import('playwright');
} catch {
  playwright = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const path = join(ROOT, decodeURIComponent(url.pathname));
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[path.slice(path.lastIndexOf('.'))] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const filter = process.argv[2];
const specs = readdirSync(join(ROOT, 'tests/components')).filter((f) => f.endsWith('.spec.mjs') && (!filter || f.includes(filter)));
const browser = await playwright.chromium.launch();
let failed = 0;
let passed = 0;
for (const spec of specs) {
  const mod = await import(pathToFileURL(join(ROOT, 'tests/components', spec)).href);
  for (const [name, fn] of Object.entries(mod.tests)) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    try {
      await fn({ page, base, expect });
      if (errors.length) throw new Error(`Console errors: ${errors.join(' | ')}`);
      passed++;
      console.log(`ok   ${spec} › ${name}`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${spec} › ${name}\n     ${e.message}`);
    }
    await context.close();
  }
}
await browser.close();
server.close();
console.log(`\ncomponents: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

function expect(actual, message) {
  return {
    toBe(v) { if (actual !== v) throw new Error(`${message || 'expected'}: ${JSON.stringify(actual)} !== ${JSON.stringify(v)}`); },
    toBeTruthy() { if (!actual) throw new Error(`${message || 'expected truthy'}: ${JSON.stringify(actual)}`); },
    toContain(v) { if (!String(actual).includes(v)) throw new Error(`${message || 'expected to contain'}: ${JSON.stringify(actual)} ⊅ ${JSON.stringify(v)}`); }
  };
}
