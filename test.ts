test('Verify Filter Dropdown', async ({ page }) => {
  // Step 1: Wait for the specific widget using a more stable and specific selector
  const widget = page.locator('app-missing-time >> .budget-card-box');

  await widget.waitFor({ state: 'visible', timeout: 30000 });

  // Step 2: Find the ng-select inside the widget
  const dropdown = widget.locator('ng-select');

  await dropdown.waitFor({ state: 'visible', timeout: 15000 });

  // Step 3: Screenshot after ensuring dropdown is visible
  await expect(dropdown).toHaveScreenshot('sr-trs-overview-missing-time-filter-dropdown.png');
});
