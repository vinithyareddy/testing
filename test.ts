// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/parallel',
  globalSetup: require.resolve('./global-setup'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3,
  timeout: 60_000,
  expect: { timeout: 30_000 },

  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list']
  ],

  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    storageState: '.auth/user.json',          // <<< KEY LINE
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    viewport: { width: 1280, height: 900 },
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
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
      snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{testName}-{projectName}{ext}',
    }
  ],
});
