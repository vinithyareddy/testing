// tests/parallel/base-fixture.ts
import { test as base, chromium, expect, type Page } from '@playwright/test';
import path from 'path';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({}, use, testInfo) => {
    const userDataDir = path.join(
      __dirname,
      `../chrome-profile-${testInfo.project.name}-w${testInfo.parallelIndex}`
    );

    const ctx = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chrome',
      headless: false,
      viewport: { width: 1280, height: 900 },
      args: ['--start-maximized'],
    });

    const page = ctx.pages()[0] || await ctx.newPage();
    if (!page.url().includes('sources-uses')) {
      await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
        waitUntil: 'domcontentloaded',
        timeout: 180_000,
      });
      await page.waitForSelector('app-budget-top-header', { timeout: 180_000 }).catch(() => {});
    }

    await use(page);
    await ctx.close();
  },
});

export { expect } from '@playwright/test';
