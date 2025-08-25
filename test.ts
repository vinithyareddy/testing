// global-fixture.ts
import { test as base, chromium, expect, type BrowserContext, type Page } from '@playwright/test';
import fs from 'fs';

export const test = base.extend<{
  browserContext: BrowserContext;
  page: Page;
}>({
  browserContext: async ({ }, use) => {
    // 1) Launch a regular (non-persistent) browser -> safe for parallel
    const browser = await chromium.launch({
      headless: true, // use --headed when debugging
      args: ['--disable-blink-features=AutomationControlled', '--start-maximized'],
    });

    // 2) Reuse saved auth if available (parallel-safe)
    const storagePath = 'storageState.json';     // put this file at repo root
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      storageState: fs.existsSync(storagePath) ? storagePath : undefined,
    });

    await use(context);

    await context.close();
    await browser.close();
  },

  page: async ({ browserContext }, use) => {
    const page = await browserContext.newPage();
    await use(page);
    await page.close();
  },
});

export { expect };
