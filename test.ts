// auth.setup.ts
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
  const authPath = path.join('.auth', 'user.json');
  fs.mkdirSync(path.dirname(authPath), { recursive: true });

  // 👇 Use your real Chrome profile directory
  const userDataDir = path.join(
    process.env.USERPROFILE || process.env.HOME!,
    'AppData',
    'Local',
    'Google',
    'Chrome',
    'User Data'
  );

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
    ],
  });

  const page = await context.newPage();

  // Go to the app; since you’re logged in already, it should skip SSO
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  // Give time for localStorage/sessionStorage to populate
  await page.waitForTimeout(3000);

  // Save full state (cookies + localStorage)
  await context.storageState({ path: authPath });
  console.log(`✅ Saved full auth state to ${authPath}`);

  await context.close();
})();


// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: 'tests/parallel',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3,
  timeout: 60000,
  expect: { timeout: 30000 },

  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    storageState: path.join(__dirname, '.auth', 'user.json'), // ✅ saved state
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    viewport: { width: 1280, height: 900 },
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chrome-parallel',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
      outputDir: './test-results/',
      snapshotDir: './.snapshots/',
      snapshotPathTemplate:
        '{snapshotDir}/{testFilePath}/{testName}-{projectName}{ext}',
    },
  ],
});


// base-fixtures.ts
import { test as base, expect, Page } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/sources-uses', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    await use(page);
  },
});

export { expect } from '@playwright/test';
