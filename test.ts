// tests/parallel/base-fixture.ts
import { test as base, expect, Page } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // You already have auth state, so just go to the page.
    await page.goto('/sources-uses', { waitUntil: 'networkidle', timeout: 60_000 });
    await use(page);
  },
});

export { expect } from '@playwright/test';
