import { defineConfig } from '@playwright/test';
import path from 'path';
import { chromium } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/parallel',
  fullyParallel: true,
  workers: 3,

  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    headless: false,
    viewport: { width: 1280, height: 900 },
  },

  projects: [
    {
      name: 'chrome-persistent',
      use: async ({}, use) => {
        const userDataDir = path.join(__dirname, 'chrome-profile'); // 👈 persistent profile
        const context = await chromium.launchPersistentContext(userDataDir, {
          channel: 'chrome',
          headless: false,
        });
        await use(context);
        await context.close();
      },
    },
  ],
});
