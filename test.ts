test('verify view more - table', async ({ page }) => {
  // Wait for widget to be visible
  const widget = page.locator('app-burnrate');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Scroll into widget
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Click on 'View More'
  const viewMore = widget.getByText('View More', { exact: true });
  await expect(viewMore).toBeVisible({ timeout: 10000 });
  await viewMore.click();

  // Wait for grid/table to load after view more
  const table = page.locator('div.ag-root.ag-unselectable.ag-layout-normal');

  // Wait up to 20s for table to appear
  await expect(table).toBeVisible({ timeout: 20000 });

  // Take screenshot once fully loaded
  await page.waitForTimeout(2000);
  await expect(table).toHaveScreenshot('sr-fp-vs-actual-responsible-view-view-more-table-visible.png');
});
