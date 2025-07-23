test('Expand icon in Uses breakdown widget table rows', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  const firstRow = widget.locator('table tbody tr').first();
  const plusIcon = firstRow.locator('td.pointer i'); // adjust if needed

  await expect(plusIcon).toBeVisible({ timeout: 10000 });
  await plusIcon.click();

  // ✅ Wait for layout to settle
  await page.waitForTimeout(1500);

  // ✅ Capture screenshot with larger timeout
  await expect(widget).toHaveScreenshot('sr-uses-breakdown-widget-plusicon-expanded-row.png', {
    timeout: 10000,
    maxDiffPixelRatio: 0.01, // tolerate small visual diff
  });
});
