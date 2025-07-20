test('Verify Uses breakdown Table is Visible', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');

  const widget = page.locator('app-uses-breakdown');

  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  console.log('🧪 Widget is visible');

  const table = widget.locator('table');

  await page.waitForTimeout(1000); // buffer for animation/render

  await expect(table).toBeVisible({ timeout: 10000 });
  await expect(table).toHaveScreenshot('sr-uses-breakdown-table-visible.png');
});
