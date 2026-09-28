// Scenario suite (BUILD_SPEC §7.3). Runs in GitHub Actions against the dev store's preview theme.
// Env: SHOP_STORE (domain), SHOP_THEME_ID, SHOP_PASSWORD, B2B_EMAIL (company contact for wholesale scenarios).
import { defineConfig, devices } from '@playwright/test';

const store = process.env.SHOP_STORE;
export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '../../playwright-report' }]],
  use: {
    baseURL: store ? `https://${store}` : undefined,
    trace: 'retain-on-failure',
    extraHTTPHeaders: {}
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } }
  ]
});
