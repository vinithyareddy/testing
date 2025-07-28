test('Verify Data Table', async ({ page }) => {
  // Wait for the ag-grid root element to appear
  const table = page.locator('body app-rm-ag-report .ag-root');
  await expect(table).toBeVisible({ timeout: 10000 });

  // Wait for the first row inside ag-grid to be rendered to ensure grid is populated
  const firstRow = page.locator('body app-rm-ag-report .ag-center-cols-container .ag-row').first();
  await expect(firstRow).toBeVisible({ timeout: 10000 });

  // Scroll the table into view to make sure it's renderable
  await table.scrollIntoViewIfNeeded();

  // Take a stable screenshot
  await expect(table).toHaveScreenshot('sr-trs-overview-time-entered-data-table.png');
});
