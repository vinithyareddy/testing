test('Expand icon in Uses breakdown widget table rows', async ({ page }) => {
  test.setTimeout(60000);

  // Locate the correct widget
  const widget = page.locator('app-uses-breakdown');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Locate the expand icon (3rd row)
  const expandIcon = widget.locator('table tbody tr:nth-child(3) td i');

  // Scroll directly to the expand icon (not the whole widget)
  await expandIcon.scrollIntoViewIfNeeded();

  // Wait for it to be visible
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Optional: Click to expand the row (if needed)
  // await expandIcon.click();
  // await page.waitForTimeout(1000);

  // Take a screenshot of the widget area
  await expect(widget).toHaveScreenshot('sr-sources-uses-expanded-row.png');
});
