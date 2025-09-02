// prepare-profiles.ts
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const APP_URL = 'https://standardreportsbetaqa.worldbank.org/sources-uses';
const BASE = path.join(__dirname, 'chrome-profile-base');

// Parse --workers=N (default 3)
function parseWorkers(): number {
  const i = process.argv.findIndex(a => a === '--workers' || a.startsWith('--workers='));
  if (i === -1) return 3;
  const val = process.argv[i].includes('=') ? process.argv[i].split('=')[1] : process.argv[i + 1];
  const n = parseInt(val ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : 3;
}
const WORKERS = parseWorkers();

function rm(p: string) { try { fs.rmSync(p, { recursive: true, force: true }); } catch {} }

(async () => {
  fs.mkdirSync(BASE, { recursive: true });

  // 1) Build/refresh the base profile by logging in once
  const ctx = await chromium.launchPersistentContext(BASE, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ['--start-maximized'],
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.waitForFunction(() => location.href.includes('sources-uses'), { timeout: 300_000 });
  await page.waitForSelector('app-budget-top-header', { timeout: 180_000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await ctx.close();

  // 2) Clone base → one profile per worker
  for (let i = 0; i < WORKERS; i++) {
    const dst = path.join(__dirname, `chrome-profile-w${i}`);
    rm(dst);
    (fs as any).cpSync(BASE, dst, { recursive: true });
    for (const f of fs.readdirSync(dst)) {
      if (f.startsWith('Singleton')) rm(path.join(dst, f)); // unlock cloned profile
    }
    console.log(`✅ Prepared profile: ${dst}`);
  }

  console.log(`\n✅ Profiles ready for ${WORKERS} workers.`);
})();

// base-fixture.ts
import { test as base, chromium, expect, BrowserContext, Page } from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  authenticatedPage: Page;
}>({
  context: [async ({}, use, testInfo) => {
    // unique profile per worker (also unique per project if you add more projects)
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

  authenticatedPage: async ({ context }, use) => {
    const page = context.pages()[0] || await context.newPage();
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

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/parallel',
  fullyParallel: true,
  workers: 3, // you can override with CLI --workers=10, etc.
  timeout: 180_000,
  expect: { timeout: 60_000 },
  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    headless: false,
    viewport: { width: 1280, height: 900 },
    navigationTimeout: 120_000,
    actionTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'DesktopChrome', use: { channel: 'chrome' } },
  ],
});

{
  "scripts": {
    "profiles": "npx ts-node prepare-profiles.ts",
    "test:parallel": "npm run profiles -- --workers=3 && npx playwright test --workers=3",
    "test:parallel:10": "npm run profiles -- --workers=10 && npx playwright test --workers=10",
    "report": "npx playwright show-report",
    "setup": "npx playwright install chrome"
  }
}
