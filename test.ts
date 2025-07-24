test('verify View More opens table and screenshot is taken', async ({ page }) => {
  test.setTimeout(90000); // Extra buffer for navigation + table load

  const widget = page.locator('app-temp-code');
  const viewMore = widget.locator('text=View More');
  const table = page.locator('div.ag-root');

  await expect(widget).toBeVisible({ timeout: 10000 });
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Let layout settle

  await viewMore.click();
  await page.waitForTimeout(15000); // Long wait for table load

  await expect(table).toBeVisible({ timeout: 20000 });
  await expect(table).toHaveScreenshot('sr-wpa-temp-code-view-more-table.png');
});
