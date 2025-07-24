test('report export excel option', async ({ page }) => {
  // Click Reports tab
  const reportsTab = page.locator('#REPORTS a span', { hasText: 'REPORTS' });
  await reportsTab.click();

  // Wait for the table icon to be present and click it
  const tableIcon = page.locator('img.img-report-icon.p-3.ng-star-inserted');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible({ timeout: 10000 });
  await tableIcon.click();

  // Wait for export option to appear
  const exportExcel = page.locator('img[alt="Export Excel"]');
  await expect(exportExcel).toBeVisible({ timeout: 10000 });

  // Screenshot the parent container instead of only the image
  const exportContainer = exportExcel.locator('..'); // parent li
  await expect(exportContainer).toHaveScreenshot('sr-wpa-reports-export-excel-visible.png');
});
