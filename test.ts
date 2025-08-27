// auth.setup.ts (LOCAL interactive login; run: npm run auth)
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
  const authPath = path.join('.auth', 'user.json');
  fs.mkdirSync(path.dirname(authPath), { recursive: true });

  // Open a visible browser so the dev can complete SSO/MFA if needed
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go straight to a known authenticated page in your app.
  // If you aren't logged in, the app should redirect you to the login/SSO screen.
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', { waitUntil: 'networkidle' });

  console.log('➡️  A browser window opened. Please complete login (SSO/MFA).');
  console.log('   This script will finish automatically once you land on /sources-uses.');

  // Wait until you are fully authenticated and on the target page
  await page.waitForURL('**/sources-uses', { timeout: 5 * 60_000 });

  // Save the authenticated storage state for future test runs
  await context.storageState({ path: authPath });
  console.log(`✅ Saved auth state to ${authPath}`);

  await browser.close();
})();
