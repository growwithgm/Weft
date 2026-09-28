// P5 pages (BUILD_SPEC §5.5, scenario 16 on the storefront side): every template renders with
// its default content, without console errors or axe violations. Page handles default to the
// demo store (P8) and can be overridden with E2E_PAGES (comma-separated paths).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { unlock, withTheme, trackErrors } from './helpers.mjs';

const paths = (process.env.E2E_PAGES ||
  '/,/collections/all,/collections,/search?q=a,/cart,/blogs/news,/pages/contact,/pages/faq,/pages/about,/pages/lookbook,/pages/shipping-calculator,/account/login,/account/register'
).split(',');

test.beforeEach(async ({ page }) => unlock(page));

for (const path of paths) {
  test(`renders ${path} without console errors or axe violations`, async ({ page }) => {
    const errors = trackErrors(page);
    const response = await page.goto(withTheme(path));
    expect(response.status(), 'status').toBeLessThan(400);
    await expect(page.locator('main#MainContent')).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('contact form shows Shopify’s errors inline', async ({ page }) => {
  await page.goto(withTheme('/pages/contact'));
  const form = page.locator('form[action*="contact"]').first();
  await form.locator('input[type="email"]').first().fill('not-an-email');
  await form.locator('input[type="email"]').first().evaluate((i) => i.removeAttribute('required'));
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('.form-message--error, input:invalid').first()).toBeVisible();
});
