// auth.setup.ts
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
  const authPath = path.join('.auth', 'user.json');
  fs.mkdirSync(path.dirname(authPath), { recursive: true });

  const userDataDir = path.join(__dirname, 'chrome-profile'); // dedicated profile
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless: false,
  });

  const page = await context.newPage();
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  console.log('➡️ Complete login (SSO/MFA) if prompted...');

  // ✅ Instead of waiting for idle network, just check URL
  await page.waitForFunction(() =>
    window.location.href.includes('sources-uses')
  , { timeout: 180000 });

  // ✅ Capture localStorage explicitly
  const state = await context.storageState();
  const localStorage = await page.evaluate(() => {
    const data: { name: string; value: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      data.push({ name: key, value: localStorage.getItem(key)! });
    }
    return data;
  });

  const finalState = {
    ...state,
    origins: [
      {
        origin: 'https://standardreportsbetaqa.worldbank.org',
        localStorage,
      },
    ],
  };

  fs.writeFileSync(authPath, JSON.stringify(finalState, null, 2));
  console.log(`✅ Saved FULL auth state (cookies + localStorage) to ${authPath}`);

  await context.close();
})();
