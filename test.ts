import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/parallel',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3,
  timeout: 60000,
  expect: {
    timeout: 30000
  },

  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list']
  ],

  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
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
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--start-maximized'
          ]
        }
      },
      outputDir: './test-results/',
      snapshotDir: './.snapshots/',
      snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{testName}-{projectName}{ext}'
    }
  ]
});