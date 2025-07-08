import { test, expect } from '@playwright/test';

test.describe('Gross outstanding exposure widget', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://mgmtqa.assetsc.worldbank.org/operation_highlight/miga');
    await page.waitForLoadState('networkidle');
  });

  test('Verify FY TO DATE tab is selected and rendered', async ({ page }) => {
    const section = page.locator('app-commitments-guarantees');

    await expect(section).toBeVisible({ timeout: 10000 });
    await section.getByRole('radio', { name: 'FY TO DATE' }).click();
    await expect(section).toHaveScreenshot('oh-miga-fy-to-date.png');
  });

  test('Verify QUARTER tab is selected and rendered', async ({ page }) => {
    const section = page.locator('app-commitments-guarantees');

    await expect(section).toBeVisible({ timeout: 10000 });
    await section.getByRole('radio', { name: 'QUARTER' }).click();
    await expect(section).toHaveScreenshot('oh-miga-quarter.png');
  });

  test('Verify 3 YEARS AVG tab is selected and rendered', async ({ page }) => {
    const section = page.locator('app-commitments-guarantees');

    await expect(section).toBeVisible({ timeout: 10000 });
    await section.getByRole('radio', { name: '3 YEARS AVG.' }).click();
    await expect(section).toHaveScreenshot('oh-miga-3years-avg.png');
  });

  test('Verify Tooltip opens and displays correct content', async ({ page }) => {
    const tooltipIcon = page.locator('app-commitments-guarantees span.widget-heading i[title]');
    await expect(tooltipIcon).toBeVisible({ timeout: 5000 });

    await tooltipIcon.click();

    const tooltipHeading = page.locator('h3.popover-title');
    await expect(tooltipHeading).toContainText('Gross outstanding exposure');

    // Close tooltip
    await page.getByRole('button', { name: 'Close' }).click();
  });

  test('Verify all 3 tab radio buttons are visible', async ({ page }) => {
    const widget = page.locator('app-commitments-guarantees');
    await expect(widget).toBeVisible({ timeout: 10000 });

    await expect(widget.getByRole('radio', { name: 'FY TO DATE' })).toBeVisible();
    await expect(widget.getByRole('radio', { name: 'QUARTER' })).toBeVisible();
    await expect(widget.getByRole('radio', { name: '3 YEARS AVG.' })).toBeVisible();
  });
});
