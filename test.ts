import { test, expect, Locator } from '../global-fixture';

// Run against: https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrdida
// Use `toMatchAriaSnapshot` and `toHaveScreenshot` for visual + accessibility validation


test.describe('Operations Highlights - IBRD+IDA Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrdida', {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForLoadState('networkidle');
  });

  // ----------------------
  // 1. HEADER VALIDATIONS
  // ----------------------
  test('Verify Header Title - Management Dashboard', async ({ page }) => {
    await expect(page.locator('header')).toMatchAriaSnapshot(`- text: Management Dashboard`);
  });

  test('Verify User Icon is Visible', async ({ page }) => {
    await expect(page.locator('img[alt="User profile picture"]')).toBeVisible();
  });

  test('Verify Help Button is Visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /help/i })).toBeVisible();
  });

  test('Verify Bell Icon is Visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /notifications/i })).toBeVisible();
  });

  test('Verify Download Button is Present', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
  });

  // -------------------------
  // 2. BREADCRUMB + TITLE
  // -------------------------
  test('Verify Breadcrumb Navigation', async ({ page }) => {
    await expect(page.locator('app-top-header')).toMatchAriaSnapshot(`
      - navigation "breadcrumb":
        - list:
          - listitem: Operations Highlights
          - listitem: / IBRD+IDA
    `);
  });

  test('Verify Page Title - IBRD+IDA', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'IBRD+IDA' })).toBeVisible();
    await expect(page.getByRole('heading')).toMatchAriaSnapshot(`- heading "IBRD+IDA" [level=2]`);
  });

  // ----------------------------------
  // 3. SIDEBAR NAVIGATION CHECKS
  // ----------------------------------
  const navItems = [
    'WBG Overview',
    'IBRD+IDA',
    'IBRD',
    'IDA',
    'IFC',
    'MIGA',
    'Thematic Highlights',
    'Finance & Risk highlights',
    'Internal Resources',
    'Guarantee Platform'
  ];

  for (const item of navItems) {
    test(`Verify Sidebar Navigation Link: ${item}`, async ({ page }) => {
      await expect(page.getByRole('link', { name: new RegExp(item, 'i') })).toBeVisible();
    });
  }

  // More widget + dropdown + card/classic/tab/date tests will be added next...

});
