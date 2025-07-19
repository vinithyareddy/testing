test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  const widget = page.locator('app-source-users');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Use a relative, clean selector for the table
  const table = widget.locator('table');

  await expect(table).toBeVisible({ timeout: 10000 });
  await expect(table).toHaveScreenshot('sr-sources-uses-table-visible.png');
});
