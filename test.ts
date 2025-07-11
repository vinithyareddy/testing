test('Verify Filter Dropdown Shows Expected Options', async ({ page }) => {
  // Step 1: Click the filter button to expand the dropdown
  const filterButton = page.locator(
    'lift-accordion-item .item-title-text' // Replace with your actual trigger class if needed
  );
  await filterButton.click();

  // Step 2: Wait briefly for dropdown animation/rendering
  await page.waitForTimeout(1000); // Stabilize for animation

  // Step 3: Confirm each option is visible (use safer text-based selectors if possible)
  const option1 = page.getByText('Fiscal Year', { exact: false });
  const option2 = page.getByText('TISVP', { exact: false });
  const option3 = page.getByText('Include Unit', { exact: false });
  const option4 = page.getByText('Month', { exact: false }); // Adjust names if needed

  await expect(option1).toBeVisible({ timeout: 10000 });
  await expect(option2).toBeVisible({ timeout: 10000 });
  await expect(option3).toBeVisible({ timeout: 10000 });
  await expect(option4).toBeVisible({ timeout: 10000 });

  // Step 4: Take screenshot of full dropdown container
  const dropdownContainer = page.locator(
    'lift-accordion-item .accordion-body' // Or update with your actual container
  );

  await dropdownContainer.scrollIntoViewIfNeeded();
  await expect(dropdownContainer).toHaveScreenshot('sr-budget-glance-filter-dropdown-options.png');
});
