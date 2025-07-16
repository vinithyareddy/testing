test('Verify Filter button opens and closes filter panel', async ({ page }) => {
  // Corrected selector for filter button (custom-styled)
  const filterButton = page.locator('label:has-text("Filter")'); // Matches the outer label with Filter text

  await expect(filterButton).toBeVisible({ timeout: 10000 });
  await filterButton.click();
  await page.waitForTimeout(1000); // Optional wait for animation

  await expect(page).toHaveScreenshot('sr-budget-glance-filter-panel-open.png');

  // Correct close icon using i inside span
  const closeIcon = page.locator('app-budget-refiner .refiner-header div:nth-child(2) > span > i');
  await expect(closeIcon).toBeVisible({ timeout: 10000 });

  // Take screenshot before closing if needed
  await closeIcon.click();
  await page.waitForTimeout(1000);

  await expect(page).toHaveScreenshot('sr-budget-glance-filter-panel-closed.png');
});
