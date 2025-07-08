test.describe('IBRD+IDA Metrics Table Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrdida');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Verify Search, Download, Columns, Fullscreen, Row', async ({ page }) => {
    // ✅ Ensure correct tab is selected
    await page.getByRole('tab', { name: 'Classic' }).click();

    // ✅ Search box interaction
    const searchBox = page.locator('#filter-text-box');
    await expect(searchBox).toBeVisible();
    await searchBox.fill('gfhfg');
    await page.waitForTimeout(500);
    await searchBox.fill('');

    // ✅ Columns tab toggle
    const columnButton = page.locator('#ag-1451-button'); // Consider using a more stable selector
    await expect(columnButton).toBeVisible();
    await columnButton.click();
    await columnButton.click(); // Toggle back

    // ✅ Download click and verify
    const downloadBtn = page.locator('li:has-text("Download")'); // More robust than nth-child
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(await download.suggestedFilename()).toMatch(/\.xlsx$/);

    // ✅ Fullscreen toggle
    const fullScreenToggle = page.locator('li img[alt="Full screen"]');
    await fullScreenToggle.click();
    await page.waitForTimeout(500);
    await fullScreenToggle.click();

    // ✅ Last row (Private Capital Mobilization)
    const tableRow = page.locator('.ag-row-last');
    await expect(tableRow).toBeVisible();
  });
});
