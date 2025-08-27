import { test as base, chromium, type BrowserContext, type Page } from '@playwright/test';

export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ }, use) => {
    // Create a new browser context for each test to ensure isolation
    const browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--start-maximized'
      ]
    });

    // Create context with viewport settings
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 }
    });

    const page = await context.newPage();

    // Navigate to the sources-uses page
    await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Wait for the page to be ready
    await page.waitForTimeout(3000);

    await use(page);

    // Cleanup
    await context.close();
    await browser.close();
  }
});

export { expect } from '@playwright/test';