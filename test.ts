test('Verify Filter Dropdown Shows Expected Options', async ({ page }) => {
  const filterButton = page.locator(
    'lift-accordion-item .item-title-text' // Shorter selector if valid
  );
  await filterButton.click();
  await page.waitForTimeout(1000); // Let dropdown finish animating

  const dropdown = page.locator(
    'lift-accordion-item .accordion-body' // Replace with your container if needed
  );

  // Validate each option
  await expect(dropdown.getByText('Fiscal Year')).toBeVisible();
  await expect(dropdown.getByText('VPU')).toBeVisible();
  await expect(dropdown.getByText('Include His Unit')).toBeVisible();
  await expect(dropdown.getByText('Posting Period')).toBeVisible();

  // Stabilize and take screenshot
  await dropdown.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(dropdown).toHaveScreenshot('sr-budget-glance-filter-dropdown-options.png');
});
