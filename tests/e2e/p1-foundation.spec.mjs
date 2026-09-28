// P1 foundation checks: layout, header, footer, localization, 404, accessibility of the home page.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { unlock, withTheme, trackErrors } from './helpers.mjs';

test.beforeEach(async ({ page }) => unlock(page));

test('home renders header, main and footer without console errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(withTheme('/'));
  await expect(page.locator('header.site-header')).toBeVisible();
  await expect(page.locator('main#MainContent')).toBeVisible();
  await expect(page.locator('footer.footer')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', /.+/);
  expect(errors).toEqual([]);
});

test('home has no axe violations', async ({ page }) => {
  await page.goto(withTheme('/'));
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('account component is visible in the header', async ({ page }) => {
  await page.goto(withTheme('/'));
  await expect(page.locator('shopify-account')).toHaveCount(1);
});

test('404 page shows the wholesale sign-in line to retail visitors', async ({ page }) => {
  await page.goto(withTheme('/products/this-product-does-not-exist-weft'));
  await expect(page.locator('.main-404__wholesale')).toBeVisible();
});

test('navigation works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await unlock(page);
  await page.goto(withTheme('/'));
  const link = page.locator('.header__nav a.menu__link, .header__nav summary').first();
  await expect(link).toBeVisible();
  await context.close();
});
