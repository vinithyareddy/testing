test('Verify Search, Download, Columns, Fullscreen, Row', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrdida');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000); // optional wait to stabilize load

  // ✅ Ensure correct tab is selected
  const classicTab = page.getByRole('tab', { name: 'Classic' });
  await expect(classicTab).toBeVisible({ timeout: 10000 });
  await classicTab.click();

  // ✅ Search box interaction
  const searchBox = page.locator('#filter-text-box');
  await expect(searchBox).toBeVisible();
  await searchBox.fill('gfhfg');
  await page.waitForTimeout(500);
  await searchBox.fill('');

  // ✅ Columns tab toggle
  const columnButton = page.locator('#ag-1451-button');
  await expect(columnButton).toBeVisible();
  await columnButton.click();
  await columnButton.click(); // Toggle back

  // ✅ Download check
  const downloadBtn = page.locator('li:has-text("Download")');
  const downloadPromise = page.waitForEvent('download');
  await downloadBtn.click();
  const download = await downloadPromise;
  expect(await download.suggestedFilename()).toMatch(/\.xlsx$/);

  // ✅ Fullscreen toggle
  const fullScreenToggle = page.locator('li img[alt="Full screen"]');
  await fullScreenToggle.click();
  await page.waitForTimeout(500);
  await fullScreenToggle.click();

  // ✅ Row check
  const tableRow = page.locator('.ag-row-last');
  await expect(tableRow).toBeVisible();
});
