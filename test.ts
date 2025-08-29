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

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', { waitUntil: 'networkidle' });

  console.log('➡️  Complete login if needed...');
  await page.waitForURL('**/sources-uses', { timeout: 5 * 60_000 });

  // Wait extra to ensure localStorage/sessionStorage is populated
  await page.waitForTimeout(3000);

  // Force capture of localStorage
  const state = await context.storageState();
  const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));

  const finalState = {
    ...state,
    origins: [
      {
        origin: 'https://standardreportsbetaqa.worldbank.org',
        localStorage: JSON.parse(localStorage),
      },
    ],
  };

  fs.writeFileSync(authPath, JSON.stringify(finalState, null, 2));
  console.log(`✅ Saved FULL auth state (cookies + localStorage) to ${authPath}`);

  await browser.close();
})();
