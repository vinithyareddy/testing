// auth.setup.ts
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
  const authPath = path.join('.auth', 'user.json');
  fs.mkdirSync(path.dirname(authPath), { recursive: true });

  // ✅ lightweight profile just for Playwright
  const userDataDir = path.join(__dirname, 'chrome-profile');

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless: false,
    args: ['--start-maximized'],
  });

  const page = await context.newPage();
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  console.log('➡️ Please log in once here (SSO/MFA).');
  await page.waitForURL('**/sources-uses', { timeout: 5 * 60_000 });

  await context.storageState({ path: authPath });
  console.log(`✅ Saved auth state to ${authPath}`);

  await context.close();
})();
