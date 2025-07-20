test('Verify Uses breakdown Table is Visible', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Expand the widget
  const expandIcon = widget.locator('span.bgt-collabse-state img');
  await expect(expandIcon).toBeVisible({ timeout: 10000 });
  await expandIcon.click();
  await page.waitForTimeout(1000); // give it time to expand

  // Now check for table inside the widget
  const table = widget.locator('table');

  await expect(table).toBeVisible({ timeout: 15000 });
  await expect(table).toHaveScreenshot('sr-uses-breakdown-table-visible.png');
});
