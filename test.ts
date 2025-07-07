const dropdownOptions = ['All Indicators', 'Primary Metrics', 'Other Metrics of Interest'];

for (const option of dropdownOptions) {
  test(`Verify Dropdown Option: ${option}`, async ({ page }) => {
    // Go to the page again to avoid context issues per iteration
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida', {
      waitUntil: 'domcontentloaded'
    });

    // Wait for the dropdown to appear
    const dropdown = page.locator('mat-select[formcontrolname="metricFilter"]');
    await expect(dropdown).toBeVisible({ timeout: 10000 });

    // Open the dropdown
    await dropdown.click();

    // Get and verify the specific dropdown option
    const optionItem = page.getByRole('option', { name: option });
    await expect(optionItem).toBeVisible({ timeout: 5000 });

    // Screenshot and click the item
    await expect(optionItem).toHaveScreenshot(`dropdown-option-${option.replace(/\s+/g, '-')}.png`);
    await optionItem.click();
  });
}
