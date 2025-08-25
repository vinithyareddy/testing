// global-fixture.ts
import { test as base, chromium, expect, type BrowserContext, type Page } from '@playwright/test';

export const test = base.extend<{
  browserContext: BrowserContext;  // stays available for other files that depend on it
  page: Page;                      // standard page fixture (test-scoped)
}>({
  // Launch a regular browser (NOT persistent), safe for parallel
  browserContext: async ({ }, use) => {
    const browser = await chromium.launch({
      headless: true, // switch to headless for parallel stability; use --headed only when debugging
      // channel: 'chrome', // optional; comment out to use bundled Chromium (faster & lighter)
      args: ['--disable-blink-features=AutomationControlled', '--start-maximized'],
    });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await use(context);
    await context.close();
    await browser.close();
  },

  // Give each test its own page from that context (no sharing across tests)
  page: async ({ browserContext }, use) => {
    const page = await browserContext.newPage();
    await use(page);
    await page.close();
  },
});

export { expect };
