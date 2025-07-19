test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  test.setTimeout(60000); // overall safety buffer

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('networkidle'); // waits until all network calls are done

  const widget = page.locator('app-source-users');
  await expect(widget).toBeVisible({ timeout: 15000 });

  // Stronger wait for table (renders after API calls likely)
  const table = widget.locator('table');

  await table.waitFor({ state: 'visible', timeout: 15000 });

  // Take screenshot only after visibility
  await expect(table).toHaveScreenshot('sr-sources-uses-table-visible.png');
});
