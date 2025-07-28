test('Expand icon in Sources and Uses widget table rows', async ({ page }) => {
  // Wait for widget itself
  const widget = page.locator('app-source-uses');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Wait for at least one table row to be rendered inside the widget
  const firstRow = widget.locator('table tbody tr').first();
  await expect(firstRow).toBeVisible({ timeout: 10000 });

  // Wait for the plus icon in the row
  const plusIcon = firstRow.locator('td.pointer i');
  await expect(plusIcon).toBeVisible({ timeout: 10000 });

  // Interact
  await plusIcon.scrollIntoViewIfNeeded();
  await plusIcon.click();

  // Wait for the expansion row (child row) to appear – optional but useful
  const expandedRow = widget.locator('table tbody tr:nth-child(2)');
  await expect(expandedRow).toBeVisible({ timeout: 10000 });

  // Screenshot after row expanded
  await expect(widget).toHaveScreenshot('sr-source-uses-widget-plusicon-expanded-row.png');
});
