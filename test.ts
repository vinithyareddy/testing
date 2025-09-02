// tests/parallel/base-fixture.ts
import { test as base, chromium, expect, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';

type TestFixtures = {
  authenticatedPage: Page;
};

type WorkerFixtures = {
  workerContext: BrowserContext; // one persistent context per worker
};

export const test = base.extend<TestFixtures, WorkerFixtures>(
  // -------- test-scoped fixtures (first arg) --------
  {
    authenticatedPage: async ({ workerContext }, use) => {
      const page = workerContext.pages()[0] || await workerContext.newPage();

      if (!page.url().includes('sources-uses')) {
        await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
          waitUntil: 'domcontentloaded',
          timeout: 180_000,
        });
        await page.waitForSelector('app-budget-top-header', { timeout: 180_000 }).catch(() => {});
      }

      await use(page);
    },
  },

  // -------- worker-scoped fixtures (second arg) --------
  {
    workerContext: async ({}, use, testInfo) => {
      const userDataDir = path.join(
        __dirname,
        `../chrome-profile-${testInfo.project.name}-w${testInfo.parallelIndex}`
      );

      const context = await chromium.launchPersistentContext(userDataDir, {
        channel: 'chrome',
        headless: false,
        viewport: { width: 1280, height: 900 },
        args: ['--start-maximized'],
      });

      await use(context);
      await context.close();
    },
  }
);

export { expect } from '@playwright/test';
