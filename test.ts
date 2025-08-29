// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),  // ✅ run before tests

  testDir: 'tests/parallel',
  fullyParallel: true,
  workers: 3,
  timeout: 60000,
  expect: { timeout: 30000 },

  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    storageState: '.auth/user.json',   // ✅ shared state for all workers
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    viewport: { width: 1280, height: 900 },
  },

  projects: [
    {
      name: 'chrome-parallel',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});


// base-fixtures.ts
import { test as base, expect, Page } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/sources-uses', { waitUntil: 'networkidle', timeout: 60000 });
    await use(page);
  },
});

export { expect } from '@playwright/test';



// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  const authPath = path.join(__dirname, '.auth', 'user.json');
  fs.mkdirSync(path.dirname(authPath), { recursive: true });

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,   // keep visible if login needs MFA, otherwise true
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // 🔑 Navigate directly to login page (adjust if needed)
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  // TODO: Automate login here if possible
  // Example for username/password login:
  // await page.fill('#username', process.env.E2E_USERNAME!);
  // await page.fill('#password', process.env.E2E_PASSWORD!);
  // await page.click('button[type="submit"]');

  // Wait until login completes
  await page.waitForURL('**/sources-uses', { timeout: 5 * 60_000 });

  // Save auth state for all parallel workers
  await context.storageState({ path: authPath });
  console.log(`✅ Saved auth state to ${authPath}`);

  await browser.close();
}

export default globalSetup;
