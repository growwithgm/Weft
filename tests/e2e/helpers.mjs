// Shared helpers for store scenarios.
export const themeId = process.env.SHOP_THEME_ID;
export const withTheme = (path) => `${path}${path.includes('?') ? '&' : '?'}preview_theme_id=${themeId}`;

/** Passes the storefront password page when the dev store is password protected. */
export async function unlock(page) {
  const password = process.env.SHOP_PASSWORD;
  await page.goto(withTheme('/'));
  if (password && (await page.locator('input[name="password"]').count())) {
    await page.locator('details.password__owner summary').click().catch(() => {});
    await page.fill('input[name="password"]', password);
    await page.locator('form[action*="password"] button[type="submit"]').click();
    await page.waitForLoadState('domcontentloaded');
  }
}

/** Collects console errors for a page. */
export function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/shopify|monorail|analytics/i.test(m.text()) && errors.push(m.text()));
  return errors;
}
