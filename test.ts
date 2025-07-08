test.describe('IBRD+IDA Metrics Table Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrdida');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // Optional: ensure layout load
  });

  test('Verify Search, Download, Columns, Fullscreen, Row', async ({ page }) => {
    // ✅ 1. Click on "Classic" tab (text-based selector, not role)
    const classicTab = page.getByText('Classic', { exact: true });
    await expect(classicTab).toBeVisible({ timeout: 10000 });
    await classicTab.scrollIntoViewIfNeeded();
    await classicTab.click();

    // ✅ 2. Verify search box interaction
    const searchBox = page.locator('#filter-text-box');
    await expect(searchBox).toBeVisible({ timeout: 5000 });
    await searchBox.fill('gfhfg');
    await page.waitForTimeout(500);
    await searchBox.fill('');

    // ✅ 3. Click Columns toggle
    const columnButton = page.locator('#ag-1451-button');
    await expect(columnButton).toBeVisible({ timeout: 5000 });
    await columnButton.click();
    await page.waitForTimeout(300);
    await columnButton.click(); // Close again

    // ✅ 4. Download button
    const downloadBtn = page.locator('li:has-text("Download")'); // safer selector
    const downloadPromise = page.waitForEvent('download');
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(await download.suggestedFilename()).toMatch(/\.xlsx$/);

    // ✅ 5. Fullscreen toggle
    const fullscreenToggle = page.locator('li:has(img[alt*="fullscreen"])');
    await fullscreenToggle.click();
    await page.waitForTimeout(300);
    await fullscreenToggle.click(); // exit fullscreen

    // ✅ 6. Verify last table row (e.g., "Private Capital Mobilization")
    const tableRow = page.locator('.ag-row-last');
    await expect(tableRow).toBeVisible({ timeout: 5000 });
  });
});
