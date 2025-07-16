test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  // Step 1: Wait for the widget container to appear
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Step 2: Try to locate the table inside the widget with a stable selector
  const table = widget.locator('table');

  // Step 3: Wait until table is rendered with at least 1 row
  await expect(table.locator('tr')).toHaveCountGreaterThan(0, { timeout: 15000 });

  // Optional debug screenshot before checking visibility
  await page.screenshot({ path: 'debug-sources-table-before-assert.png', fullPage: false });

  // Step 4: Ensure table is visible
  await expect(table).toBeVisible();

  // Step 5: Screenshot for validation
  await expect(table).toHaveScreenshot('sr-budget-glance-sources-table-visible.png');
});
