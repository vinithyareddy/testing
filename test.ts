// global-fixture.ts
import { test as base, chromium, expect, type BrowserContext, type Page } from '@playwright/test';
import os from 'os';
import fs from 'fs';
import path from 'path';

export const test = base.extend<{
  browserContext: BrowserContext;
  page: Page;
}>({
  // One persistent profile PER WORKER (no locking, no collisions)
  browserContext: [async ({ }, use, workerInfo) => {
    const profileDir = path.join(os.tmpdir(), `pw-profile-${workerInfo.workerIndex}-${Date.now()}`);
    // start with a clean dir each time
    fs.rmSync(profileDir, { recursive: true, force: true });

    const context = await chromium.launchPersistentContext(profileDir, {
      headless: false,                   // show the browser (set true in CI)
      // Use EITHER channel OR executablePath. Prefer channel; remove executablePath.
      channel: 'chrome',
      // executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', // <- remove if using channel
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
  }, { scope: 'worker' }],

  page: async ({ browserContext }, use) => {
    // Ensure we actually have a page to work with
    const existing = browserContext.pages();
    const page = existing.length ? existing[0] : await browserContext.newPage();
    await use(page);
  },
});

export { expect };
