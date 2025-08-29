// playwright.config.ts
import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),

  testDir: 'tests/parallel',
  fullyParallel: true,
  workers: 3,

  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    headless: false,
    viewport: { width: 1280, height: 900 },
    storageState: path.join(__dirname, '.auth', 'user.json'), // 👈 absolute path
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { channel: 'chrome' },
    },
  ],
});

// auth.setup.ts
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
  const authPath = path.join('.auth', 'user.json');
  fs.mkdirSync(path.dirname(authPath), { recursive: true });

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('➡️ Please complete login (SSO/MFA) if prompted...');

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  });

  // Don’t rely on network idle; just confirm we’re on the right page
  await page.waitForFunction(
    () => window.location.href.includes('sources-uses'),
    { timeout: 180_000 }
  );

  // Give the app a moment to write MSAL tokens
  await page.waitForTimeout(2000);

  // Capture base storage state first (cookies for all domains)
  const state = await context.storageState();

  // Capture app origin localStorage (MSAL tokens live here)
  const appOrigin = 'https://standardreportsbetaqa.worldbank.org';
  const localStorage = await page.evaluate(() => {
    const data: { name: string; value: string }[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)!;
      const value = window.localStorage.getItem(key)!;
      data.push({ name: key, value });
    }
    return data;
  });

  // Merge cookies with explicit localStorage for the app origin
  const finalState = {
    ...state,
    origins: [
      ...(state as any).origins?.filter((o: any) => o.origin !== appOrigin) ?? [],
      { origin: appOrigin, localStorage },
    ],
  };

  fs.writeFileSync(authPath, JSON.stringify(finalState, null, 2));
  console.log(`✅ Saved FULL auth state (cookies + localStorage) to ${authPath}`);

  await browser.close();
})();
