import { test as base, chromium, expect, type BrowserContext, type Page } from '@playwright/test';
import os from 'os';
import fs from 'fs';
import path from 'path';

export const test = base.extend<{
  browserContext: BrowserContext;
  page: Page;
}>({
  browserContext: async ({ }, use, workerInfo) => {
    const profileDir = path.join(os.tmpdir(), `pw-profile-${workerInfo.workerIndex}-${Date.now()}`);
    fs.rmSync(profileDir, { recursive: true, force: true });

    const context = await chromium.launchPersistentContext(profileDir, {
      headless: false, // flip to true for CI
      channel: 'chrome',
      viewport: { width: 1280, height: 900 },
      args: [
        '--disable-blink-features=AutomationControlled',
        '--start-maximized',
        '--disable-dev-shm-usage',
      ],
    });

    try {
      await use(context);
    } finally {
      await context.close();
      fs.rmSync(profileDir, { recursive: true, force: true });
    }
  },

  page: async ({ browserContext }, use) => {
    const existing = browserContext.pages();
    const page = existing.length ? existing[0] : await browserContext.newPage();
    await use(page);
  },
});

export { expect };
