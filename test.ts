test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  // Step 1: Wait for the Sources and Uses widget to appear
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Step 2: Wait for the specific table inside the widget to load
  const table = page.locator(
    'app-home-source-uses >>> div.TableView table'
  );
  await table.waitFor({ state: 'visible', timeout: 10000 });

  // Step 3: Assert table is visible
  await expect(table).toBeVisible();

  // Step 4: Screenshot for validation
  await expect(table).toHaveScreenshot('sr-budget-glance-sources-table-visible.png');
});
