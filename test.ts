// tests/parallel/base-fixture.ts
import { test as base, chromium, expect, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  workerContext: BrowserContext;   // our own worker-scoped context
  authenticatedPage: Page;
}>({
  // 1) One persistent context per WORKER (not per test)
  workerContext: [async ({}, use, testInfo) => {
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
  }, { scope: 'worker' }],

  // 2) Reuse that context to provide your existing fixture
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
});

export { expect } from '@playwright/test';
