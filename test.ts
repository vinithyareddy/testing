test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  // Wait for the widget container
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Locate the table inside the widget
  const table = widget.locator('table');

  // Ensure it's visible
  await expect(table).toBeVisible({ timeout: 5000 });

  // Screenshot for validation
  await expect(table).toHaveScreenshot('sr-budget-glance-sources-table-visible.png');
});
