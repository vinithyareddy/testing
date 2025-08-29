// persistent-fixture.ts
import { test as base, chromium, BrowserContext, Page, expect } from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  page: Page;
}>({
  context: async ({}, use) => {
    // 👇 This folder will hold your Chrome profile data
    const userDataDir = path.join(__dirname, 'chrome-profile');

    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chrome',
      headless: false,
      viewport: { width: 1280, height: 900 },
      args: ['--start-maximized'],
    });

    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = context.pages()[0] || await context.newPage();
    await use(page);
  },
});

export { expect } from '@playwright/test';
