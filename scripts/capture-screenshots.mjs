#!/usr/bin/env node
// Takes the Theme Store listing screenshots of a demo store's home page (BUILD_SPEC §8.4 step 3):
// desktop 2000 x 2496px (a 1000 x 1248 viewport at 2x) and mobile 750 x 1334px (375 x 667 at 2x),
// viewport only, no browser window. It only reads the storefront; nothing is changed.
//
//   node scripts/capture-screenshots.mjs --preset weft --url https://weft-demo.myshopify.com [--out dist/screenshots]
//   Password-protected stores: set DEMO_PASSWORD.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const preset = arg('preset');
const url = arg('url');
const out = join(arg('out', 'dist/screenshots'), preset || '');
if (!preset || !/^https:\/\//.test(url || '')) {
  console.error('Usage: node scripts/capture-screenshots.mjs --preset <weft|tress|balm> --url https://<demo store> [--out <dir>]');
  process.exit(2);
}

let playwright;
try {
  playwright = await import('playwright');
} catch {
  playwright = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
}

const shots = [
  { name: 'desktop', viewport: { width: 1000, height: 1248 }, deviceScaleFactor: 2, isMobile: false },
  { name: 'mobile', viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
];

mkdirSync(out, { recursive: true });
const browser = await playwright.chromium.launch();
try {
  for (const shot of shots) {
    const context = await browser.newContext({ ...shot, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    if (process.env.DEMO_PASSWORD && (await page.locator('input[name="password"]').count())) {
      await page.locator('details.password__owner summary').click().catch(() => {});
      await page.fill('input[name="password"]', process.env.DEMO_PASSWORD);
      await Promise.all([page.waitForNavigation(), page.locator('input[name="password"]').press('Enter')]);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    }
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    // Let images above the fold finish, then capture the viewport only.
    await page.waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight).every((i) => i.complete));
    const file = join(out, `${preset}-home-${shot.name}.png`);
    await page.screenshot({ path: file });
    console.log(`capture-screenshots: ${file} (${shot.viewport.width * shot.deviceScaleFactor} x ${shot.viewport.height * shot.deviceScaleFactor}px)`);
    await context.close();
  }
} finally {
  await browser.close();
}
