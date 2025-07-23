test('Verify Data Table', async ({ page }) => {
  // Step 1: Click "View More" inside the widget
  const viewMoreButton = page.locator('app-missing-time >> text=View More');
  await viewMoreButton.waitFor({ state: 'visible', timeout: 15000 });
  await viewMoreButton.scrollIntoViewIfNeeded();
  await viewMoreButton.click();

  // Step 2: Wait for table to render (ag-grid root)
  const table = page.locator('.ag-root.ag-unselectable.ag-layout-normal'); // Use class-based selector for resilience
  await table.waitFor({ state: 'visible', timeout: 20000 });

  // Step 3: Screenshot of data table
  await expect(table).toHaveScreenshot('sr-trs-overview-missing-time-data-table.png');
});
