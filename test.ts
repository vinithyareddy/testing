import { test, expect } from '@playwright/test';

test.describe('Gross outstanding exposure Widget - Tab Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://mgmtqa.assetsc.worldbank.org/operation_highlight/miga');
    await page.waitForLoadState('networkidle');

    // Wait for the heading of the widget to appear
    await expect(page.getByRole('heading', { name: 'Gross outstanding exposure' })).toBeVisible({ timeout: 10000 });
  });

  test('FY TO DATE tab is visible and renders screenshot', async ({ page }) => {
    const widget = page.locator('text=Gross outstanding exposure').locator('..'); // move to parent
    await widget.getByRole('radio', { name: 'FY TO DATE' }).click();
    await expect(widget).toHaveScreenshot('fy-to-date.png');
  });

  test('QUARTER tab is visible and renders screenshot', async ({ page }) => {
    const widget = page.locator('text=Gross outstanding exposure').locator('..');
    await widget.getByRole('radio', { name: 'QUARTER' }).click();
    await expect(widget).toHaveScreenshot('quarter.png');
  });

  test('3 YEARS AVG. tab is visible and renders screenshot', async ({ page }) => {
    const widget = page.locator('text=Gross outstanding exposure').locator('..');
    await widget.getByRole('radio', { name: '3 YEARS AVG.' }).click();
    await expect(widget).toHaveScreenshot('3years-avg.png');
  });
});
