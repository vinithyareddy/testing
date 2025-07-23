test('Expand icon in Sources and Uses widget table rows', async ({ page }) => {
  const widget = page.locator('app-source-uses');
  await expect(widget).toBeVisible({ timeout: 10000 });

  const firstRow = widget.locator('table tbody tr').first();
  const plusIcon = firstRow.locator('td.pointer i'); // or adjust tag/class if needed

  await expect(plusIcon).toBeVisible({ timeout: 10000 });
  await plusIcon.click();

  // Wait for expanded content — e.g., next row to appear
  const expandedRow = widget.locator('table tbody tr:nth-child(2)');
  await expect(expandedRow).toBeVisible({ timeout: 5000 });

  // Or wait for stability before screenshot
  await page.waitForTimeout(1000);

  // Now take screenshot of the widget
  await expect(widget).toHaveScreenshot('sr-source-uses-widget-plusicon-expanded-row.png');
});
