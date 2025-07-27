test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  // Optional wait in case page or widget is loading
  await page.waitForTimeout(1000);

  // Step 1: Make sure the main widget is loaded
  const widget = page.locator('app-sources-breakdown');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Step 2: Find the actual AG Grid table
  const table = page.locator('div.ag-root.ag-unselectable.ag-layout-normal');
  await expect(table).toBeVisible({ timeout: 10000 });

  // Optional scroll if needed
  await table.scrollIntoViewIfNeeded();

  // Step 3: Take a screenshot of the table only
  await table.screenshot({ path: 'sr-sources-uses-sources-breakdown-table-visible.png' });
});
