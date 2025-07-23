test('Verify Filter Dropdown in Missing Time Widget', async ({ page }) => {
  // Step 1: Locate the widget
  const widget = page.locator('app-missing-time');

  // Step 2: Wait until widget is visible
  await expect(widget).toBeVisible({ timeout: 15000 });

  // Step 3: Inside that widget, locate the dropdown
  const dropdown = widget.locator('ng-select');

  // Step 4: Wait for dropdown and take screenshot
  await expect(dropdown).toBeVisible({ timeout: 10000 });
  await expect(dropdown).toHaveScreenshot('sr-trs-overview-missing-time-filter-dropdown.png');
});
