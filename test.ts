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

  // Navigate to app
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
    waitUntil: 'networkidle',
    timeout: 120_000,
  });

  // Wait until login is successful (redirected to dashboard)
  await page.waitForURL('**/sources-uses', { timeout: 300_000 });

  // Save state
  await context.storageState({ path: authPath });
  console.log(`✅ Saved auth state to ${authPath}`);

  await browser.close();
})();



// global-setup.ts
import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  const authFile = '.auth/user.json';

  if (!fs.existsSync(authFile)) {
    console.log('⚡ No auth state found. Running auth.setup.ts...');
    execSync('npx ts-node auth.setup.ts', { stdio: 'inherit' });
  } else {
    console.log('✅ Using existing auth state.');
  }
}

export default globalSetup;



// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),

  testDir: 'tests/parallel',
  fullyParallel: true,
  workers: 3, // run tests in parallel

  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    headless: false,
    viewport: { width: 1280, height: 900 },
    storageState: '.auth/user.json',   // ✅ shared login state
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


"scripts": {
  "auth": "npx ts-node auth.setup.ts",
  "test": "npx playwright test --workers=3",
  "test:headed": "npx playwright test --workers=3 --headed",
  "test:update-snapshots": "npx playwright test --update-snapshots --workers=1",
  "report": "npx playwright show-report",
  "setup": "npx playwright install chrome"
}
