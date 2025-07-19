test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('networkidle');

  // Wait for the overall widget
  const widget = page.locator('#Dashboard > div > div > div:nth-child(1) > div > app-source-users > div');
  await expect(widget).toBeVisible({ timeout: 20000 });

  // Now select the actual <table> inside that widget
  const table = widget.locator('table');

  // Make sure table and at least one row is rendered
  const firstRow = table.locator('tbody tr').first();
  await expect(firstRow).toBeVisible({ timeout: 20000 });

  // Take screenshot once it's fully rendered
  await expect(table).toHaveScreenshot('sr-sources-uses-table-visible.png');
});
