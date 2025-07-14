test('Verify Filter button opens and closes filter panel', async ({ page }) => {
  const filterButton = page.locator('button:has-text("Filter")');

  // Wait for button and click to open
  await expect(filterButton).toBeVisible({ timeout: 20000 });
  await filterButton.click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveScreenshot('sr-budget-glance-filter-panel-open.png');

  // Locate the close (X) icon
  const closeIcon = page.locator('button[aria-label="Close"]'); // Adjust this if needed
  await expect(closeIcon).toBeVisible({ timeout: 10000 });

  // Click close icon
  await closeIcon.click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveScreenshot('sr-budget-glance-filter-panel-closed.png');
});
