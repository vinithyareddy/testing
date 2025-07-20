test('Expand icon in Uses breakdown widget table rows', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');

  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Wait for the table to appear inside the widget
  const table = widget.locator('table');
  await expect(table).toBeVisible({ timeout: 10000 });

  // Use robust relative selector to find the expand icon in third row
  const plusIcon = table.locator('tbody tr:nth-child(3) td i'); // generalize if needed

  await expect(plusIcon).toBeVisible({ timeout: 5000 });

  await plusIcon.click();
  await page.waitForTimeout(1000); // allow animation or row expansion

  // Validate expanded content is shown
  const expandedRow = table.locator('tbody tr:nth-child(3)');
  await expect(expandedRow).toBeVisible();

  await expect(expandedRow).toHaveScreenshot('sr-uses-breakdown-expanded-row.png');
});
