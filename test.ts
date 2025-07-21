test('Expand icon in Uses breakdown widget table rows', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('networkidle');

  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  const expandIcon = widget.locator('table tbody tr:nth-child(3) td.pointer i');
  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  await expandIcon.click();
  await page.waitForTimeout(1500); // allow expand animation

  // More robust: wait for new content
  const expandedRow = widget.locator('.ag-row-level-1'); // Use .ag-row-level-1 or valid selector
  await expandedRow.scrollIntoViewIfNeeded();
  await expect(expandedRow).toBeVisible();

  // Forcefully capture screenshot
  await expect(expandedRow).toHaveScreenshot('sr-sources-uses-expanded-row.png', {
    animations: 'disabled',
    timeout: 10000,
  });
});
