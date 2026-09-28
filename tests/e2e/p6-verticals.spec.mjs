// P6 scenarios (BUILD_SPEC §7.3 #17–#22) against the dev store's preview theme. Product handles
// default to the demo catalogs (VERTICALS §5, P8) and can be overridden. The hair care and body
// care products use the alternate templates product.hair-care / product.body-care (?view=).
import { test, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unlock, withTheme, trackErrors } from './helpers.mjs';

const handles = {
  hair: process.env.E2E_HAIR_PRODUCT || 'argan-repair-shampoo',
  body: process.env.E2E_BODY_PRODUCT || 'whipped-shea-body-butter',
  professional: process.env.E2E_PROFESSIONAL_PRODUCT || 'back-bar-shampoo',
  finderPage: process.env.E2E_FINDER_PAGE || 'find-your-routine',
  quickOrderPage: process.env.E2E_QUICK_ORDER_PAGE || 'quick-order'
};

let storageState;
if (process.env.B2B_STORAGE_STATE) {
  storageState = join(tmpdir(), 'weft-b2b-state-p6.json');
  writeFileSync(storageState, process.env.B2B_STORAGE_STATE);
}

test.describe('retail visitor', () => {
  test.beforeEach(async ({ page }) => unlock(page));

  test('#17 hair care product: unit price, subscription, highlights, chips, ingredients, how to use, routine', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(withTheme(`/products/${handles.hair}?view=hair-care`));
    await expect(page.locator('.product-price .price__unit').first()).toBeVisible();
    await expect(page.locator('.purchase-options')).toBeVisible();
    await expect(page.locator('.highlights')).toBeVisible();
    await expect(page.locator('.attribute-chips')).toBeVisible();
    await expect(page.locator('.ingredients')).toBeVisible();
    await expect(page.locator('.ingredients__full')).toHaveCount(1);
    await expect(page.locator('.how-to')).toBeVisible();
    await expect(page.locator('.complementary')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('#18 body care product: scent notes, chips, INCI, warnings, period after opening, gift message, unit price', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(withTheme(`/products/${handles.body}?view=body-care`));
    await expect(page.locator('.scent-notes')).toBeVisible();
    await expect(page.locator('.attribute-chips')).toBeVisible();
    await expect(page.locator('.ingredients__full')).toHaveCount(1);
    await expect(page.locator('.accordion', { hasText: /warning|precaution/i }).first()).toBeVisible();
    await expect(page.locator('.pao')).toBeVisible();
    const gift = page.locator('.custom-option textarea[name="properties[Gift message]"]');
    await expect(gift).toBeVisible();
    await gift.fill('Happy birthday');
    await expect(page.locator('.custom-option__count')).toContainText('14');
    await expect(page.locator('.product-price .price__unit').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('#19 professional-only product is hidden from retail visitors', async ({ page }) => {
    const response = await page.goto(withTheme(`/products/${handles.professional}`));
    const gated = (await page.locator('.wholesale-gate').count()) > 0;
    expect(response.status() === 404 || gated).toBe(true);
  });

  test('#21 guided finder leads to a filtered collection; the slider follows the keyboard', async ({ page }) => {
    await page.goto(withTheme(`/pages/${handles.finderPage}`));
    const finder = page.locator('guided-finder');
    await expect(finder).toBeVisible();
    const steps = finder.locator('[data-finder-step]');
    const count = await steps.count();
    // Choosing an answer moves on to the next question.
    for (let i = 0; i < count; i++) {
      await expect(steps.nth(i)).toBeVisible();
      await steps.nth(i).locator('.finder__option').first().click();
    }
    await Promise.all([page.waitForURL(/filter\./), finder.locator('[data-finder-submit]').click()]);
    expect(new URL(page.url()).pathname).toMatch(/^\/(collections|[a-z]{2}(-[a-z]{2})?\/collections)\//);

    await page.goto(withTheme(`/pages/${handles.finderPage}`));
    const range = page.locator('[data-compare-range]');
    await expect(range).toBeVisible();
    const before = Number(await range.inputValue());
    await range.focus();
    await page.keyboard.press('ArrowRight');
    expect(Number(await range.inputValue())).toBeGreaterThan(before);
  });

  test('#22 Theme Store features: account, unit prices, selling plan in cart, filters on search, pickup', async ({ page }) => {
    await page.goto(withTheme('/'));
    await expect(page.locator('shopify-account, a[href*="/account"]').first()).toBeAttached();
    if ((await page.locator('.footer__follow').count()) > 0) await expect(page.locator('.footer__follow').first()).toBeVisible();

    await page.goto(withTheme(`/products/${handles.hair}`));
    await expect(page.locator('.price__unit').first()).toBeVisible();
    await expect(page.locator('pickup-availability')).toHaveCount(1);

    const product = await (await page.request.get(`/products/${handles.hair}.js`)).json();
    const plan = product.selling_plan_groups?.[0]?.selling_plans?.[0];
    test.skip(!plan, 'the hair care product has no selling plan');
    await page.request.post('/cart/add.js', { data: { items: [{ id: product.variants[0].id, quantity: 1, selling_plan: plan.id }] } });
    await page.goto(withTheme('/cart'));
    await expect(page.locator('.cart-line__options', { hasText: plan.name }).first()).toBeVisible();

    await page.goto(withTheme('/search?q=a&type=product'));
    await expect(page.locator('[data-facets-form]').first()).toBeAttached();
  });
});

test.describe('wholesale buyer', () => {
  test.skip(!storageState, 'B2B_STORAGE_STATE is not set (see docs/progress.md, Owner actions)');
  test.use({ storageState });
  test.beforeEach(async ({ page }) => unlock(page));

  test('#19 professional-only product is orderable with its case-pack rule', async ({ page }) => {
    await page.goto(withTheme(`/products/${handles.professional}`));
    const box = page.locator('wholesale-quantity, order-matrix').first();
    await expect(box).toBeVisible();
    const input = box.locator('input[name="quantity"], [data-cell-input]').first();
    const step = Number((await input.getAttribute('step')) || 1);
    if (step > 1) {
      await input.fill(String(step + 1));
      await input.blur();
      expect(Number(await input.inputValue()) % step).toBe(0);
    }
  });

  test('#20 quick order list orders across products', async ({ page }) => {
    await page.goto(withTheme(`/pages/${handles.quickOrderPage}`));
    const list = page.locator('order-matrix.quick-order__list');
    await expect(list).toBeVisible();
    expect(await list.locator('[data-row]').count()).toBeGreaterThan(1);
  });
});
