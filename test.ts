test('Expand icon in Sources and Uses widget table rows', async ({ page }) => {
  const widget = page.locator('app-source-uses');
  await expect(widget).toBeVisible({ timeout: 15000 });
  const firstRow = widget.locator('table tbody tr').first();
  await expect(firstRow).toBeVisible({ timeout: 15000 });
  const plusIcon = firstRow.locator('td.pointer i');
  await expect(plusIcon).toHaveCount(1, { timeout: 10000 });
  await expect(plusIcon).toBeVisible({ timeout: 10000 });
  await plusIcon.scrollIntoViewIfNeeded();
  await plusIcon.click();
  const expandedRow = widget.locator('table tbody tr:nth-child(2)');
  await expect(expandedRow).toBeVisible({ timeout: 10000 });
  await expect(widget).toHaveScreenshot('sr-source-uses-widget-plusicon-expanded-row.png');
});
