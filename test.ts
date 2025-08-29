import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/parallel',
  fullyParallel: true,
  workers: 3,

  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    headless: false,
    viewport: { width: 1280, height: 900 },
    storageState: '.auth/user.json',   // 👈 use saved auth for all workers
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        channel: 'chrome',
      },
    },
  ],
});
