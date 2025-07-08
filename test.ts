import { test, expect } from '@playwright/test';

test.describe('IBRD+IDA Metrics Table Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://mgmtqa.assetg.worldbank.org/operation_highlight/ibrdida');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Verify Search, Download, Columns, Fullscreen, Row', async ({ page }) => {

    // Verify search box and enter text
    const searchBox = page.locator('#filter-text-box');
    await expect(searchBox).toBeVisible();
    await searchBox.fill('gfhfg');
    await page.waitForTimeout(500);
    await searchBox.fill('');

    // Click Columns tab
    const columnButton = page.locator('#ag-1451-button');
    await expect(columnButton).toBeVisible();
    await columnButton.click();
    await columnButton.click(); // Toggle back

    // Click Download
    const downloadBtn = page.locator('#tab2 > div > app-metrics-table > div.main-table > div.row.mt-n4.mb-3 > div > ul > li:nth-child(2)');
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(await download.suggestedFilename()).toMatch(/\.xlsx$/);

    // Full screen toggle
    const fullScreenToggle = page.locator('#tab2 > div > app-metrics-table > div.main-table > div.row.mt-n4.mb-3 > div > ul > li:nth-child(3) > img');
    await fullScreenToggle.click();
    await page.waitForTimeout(500);
    await fullScreenToggle.click();

    // Check the table row with "Private Capital Mobilization"
    const tableRow = page.locator('.ag-row-last');
    await expect(tableRow).toBeVisible();
  });

});
