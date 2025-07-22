test('Expand icon in Sources and Uses widget table rows', async ({ page }) => {
  const widget = page.locator('app-source-uses');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Locate the first row in the table using role and relative path
  const firstRow = widget.locator('table tbody tr').first();

  // Now locate the plus icon within the first row using tag or class
  const plusIcon = firstRow.locator('td.pointer i'); // assuming <i> is used for the plus icon

  // Ensure the icon is visible before clicking
  await expect(plusIcon).toBeVisible({ timeout: 10000 });

  await plusIcon.click();

  // Wait for expansion
  await page.waitForTimeout(1000); // shorter wait after click

  // Take screenshot of the entire widget with expanded row
  await expect(widget).toHaveScreenshot('sr-source-uses-widget-expanded-row.png');
});
