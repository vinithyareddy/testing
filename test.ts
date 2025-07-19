test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('networkidle');

  const widget = page.locator('app-source-users');
  await expect(widget).toBeVisible({ timeout: 20000 });

  // Wait for ANY table inside widget — avoids brittle selector logic
  const table = widget.locator('table');

  // Retry until the first table row exists and is visible
  await expect(table.locator('tbody tr')).first().toBeVisible({ timeout: 20000 });

  // Now confirm full table screenshot
  await expect(table).toHaveScreenshot('sr-sources-uses-table-visible.png');
});
