test('Expand icon in Uses breakdown widget table rows', async ({ page }) => {
  test.setTimeout(60000);

  // Go to the page
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('networkidle');

  // Locate the widget
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Use relative locator inside the widget
  const expandIcon = widget.locator('table tbody tr:nth-child(3) td.pointer i');

  // Ensure icon is visible
  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Click the icon to expand (optional, if just visual state is needed)
  await expandIcon.click();

  // Screenshot after expanding
  await expect(widget).toHaveScreenshot('sr-sources-uses-expanded-row.png');
});
