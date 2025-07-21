test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  test.setTimeout(60000); // Increase timeout for slow-loading dashboards

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');

  // Wait until everything on the page has fully loaded
  await page.waitForLoadState('networkidle');

  // Locate the main widget
  const widget = page.locator('#Dashboard > div > div > div:nth-child(1) > div > app-source-users > div');

  await widget.scrollIntoViewIfNeeded(); // Ensure it's on screen
  await expect(widget).toBeVisible({ timeout: 20000 });

  // Locate the table inside the widget
  const table = widget.locator('table');

  // Make sure the table exists and is visible before screenshotting
  await expect(table).toBeVisible({ timeout: 10000 });
  await table.scrollIntoViewIfNeeded();
  await expect(table).toHaveScreenshot('sr-sources-uses-table-visible.png');
});
