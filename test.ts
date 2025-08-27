// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1) Go to your app's login page
  await page.goto('https://standardreportsbetaqa.worldbank.org/login', { waitUntil: 'networkidle' });

  // 2) Fill credentials (use env vars; never hardcode)
  await page.getByLabel('Username').fill(process.env.E2E_USER ?? '');
  await page.getByLabel('Password').fill(process.env.E2E_PASS ?? '');
  await page.getByRole('button', { name: /sign in|login/i }).click();

  // 3) Wait until you're truly logged in (e.g., landing on app shell)
  await page.waitForURL('**/sources-uses', { timeout: 60_000 });

  // 4) Save auth state
  await context.storageState({ path: '.auth/user.json' });

  await browser.close();
}
