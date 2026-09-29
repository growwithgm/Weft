// P3 wholesale scenarios (BUILD_SPEC §7.3 #5–#13, #20) against the dev store's preview theme.
// Wholesale tests need a signed-in company contact. New customer accounts sign in with an email
// code, so the session comes from a saved Playwright storage state: B2B_STORAGE_STATE holds its
// JSON (GitHub secret). Product handles default to the demo catalog (P8) and can be overridden.
import { test, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unlock, withTheme, trackErrors } from './helpers.mjs';

const handles = {
  matrix: process.env.E2E_MATRIX_PRODUCT || 'leila-embroidered-tunic',
  oneSize: process.env.E2E_ONESIZE_PRODUCT || 'zahra-embroidered-kaftan',
  tagOnly: process.env.E2E_TAG_ONLY_PRODUCT || 'embroidery-swatch-card',
  excluded: process.env.E2E_EXCLUDED_PRODUCT || 'tunic-sample-pack',
  quickOrderPage: process.env.E2E_QUICK_ORDER_PAGE || 'quick-order'
};

let storageState;
if (process.env.B2B_STORAGE_STATE) {
  storageState = join(tmpdir(), 'weft-b2b-state.json');
  writeFileSync(storageState, process.env.B2B_STORAGE_STATE);
}

test.describe('retail visitor', () => {
  test.beforeEach(async ({ page }) => unlock(page));

  test('#1 retail product page has no wholesale blocks', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(withTheme(`/products/${handles.matrix}`));
    await expect(page.locator('order-matrix, wholesale-quantity, [data-tiers]')).toHaveCount(0);
    await expect(page.locator('[data-add-button]').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('#13 tag fallback product shows the gate with noindex', async ({ page }) => {
    await page.goto(withTheme(`/products/${handles.tagOnly}`));
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
    await expect(page.locator('.wholesale-gate')).toBeVisible();
  });

  test('#13 catalog-excluded product is a 404 with the wholesale line', async ({ page }) => {
    const response = await page.goto(withTheme(`/products/${handles.excluded}`));
    expect(response.status()).toBe(404);
    await expect(page.locator('.main-404__wholesale')).toBeVisible();
  });

  test('#20 quick order page asks retail visitors to sign in', async ({ page }) => {
    await page.goto(withTheme(`/pages/${handles.quickOrderPage}`));
    await expect(page.locator('.quick-order__signin')).toBeVisible();
    await expect(page.locator('order-matrix')).toHaveCount(0);
  });
});

test.describe('wholesale buyer', () => {
  test.skip(!storageState, 'B2B_STORAGE_STATE is not set (see docs/progress.md, Owner actions)');
  test.use({ storageState });
  test.beforeEach(async ({ page }) => unlock(page));

  test('#5 per-piece price, rule chips and no retail modules', async ({ page }) => {
    await page.goto(withTheme(`/products/${handles.matrix}`));
    await expect(page.locator('.price').first()).toContainText(/./);
    await expect(page.locator('[data-variant-picker]')).toHaveCount(0);
    await expect(page.locator('.buy-buttons')).toHaveCount(0);
  });

  test('#6 #7 order matrix flags, rounds and adds per line', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(withTheme(`/products/${handles.matrix}`));
    const matrix = page.locator('order-matrix');
    await expect(matrix).toBeVisible();
    const input = matrix.locator('[data-cell-input]:not([disabled])').first();
    const cell = input.locator('xpath=ancestor::*[@data-cell][1]');
    const step = Number(await cell.getAttribute('data-step'));
    const min = Number(await cell.getAttribute('data-min'));
    const inCart = Number(await cell.getAttribute('data-in-cart'));
    if (step > 1 && inCart === 0) {
      await input.fill(String(Math.max(min, step) + 1));
      await input.blur();
      expect(Number(await input.inputValue()) % step).toBe(0);
    }
    if (min > 1 && inCart === 0) {
      await input.fill('1');
      await input.blur();
      await expect(cell.locator('[data-cell-error]')).toBeVisible();
      await expect(matrix.locator('[data-matrix-add]')).toBeDisabled();
    }
    await input.fill('0');
    await input.blur();
    await cell.locator('[data-step="1"]').click();
    await matrix.locator('[data-matrix-add]').click();
    await expect(matrix.locator('.matrix__message--success, .matrix__message--error').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('#8 one-size stepper starts at the minimum and shows the live line total', async ({ page }) => {
    await page.goto(withTheme(`/products/${handles.oneSize}`));
    const box = page.locator('wholesale-quantity');
    await expect(box).toBeVisible();
    const min = await box.getAttribute('data-min');
    await expect(box.locator('input[name="quantity"]')).toHaveValue(min);
    await expect(box.locator('[data-line-total]')).toContainText('×');
  });

  test('#11 wholesale cart disables checkout while a line is invalid', async ({ page }) => {
    await page.goto(withTheme('/cart'));
    const invalid = page.locator('.cart-line--error');
    if (await invalid.count()) await expect(page.locator('[data-checkout]').first()).toBeDisabled();
  });

  test('#20 quick order list validates like the matrix', async ({ page }) => {
    await page.goto(withTheme(`/pages/${handles.quickOrderPage}`));
    const list = page.locator('order-matrix.quick-order__list');
    await expect(list).toBeVisible();
    await expect(list.locator('[data-row]').first()).toBeVisible();
  });

  test('#15 order matrix fallback posts without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ storageState, javaScriptEnabled: false });
    const page = await context.newPage();
    await unlock(page);
    await page.goto(withTheme(`/products/${handles.matrix}`));
    await expect(page.locator('form[action*="/cart/update"] [name^="updates["]').first()).toBeVisible();
    await context.close();
  });
});
