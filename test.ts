test('Verify Filter button opens and closes filter panel', async ({ page }) => {
  const filterButton = page.getByRole('button', { name: /Filter/i });

  // Wait for it to be visible
  await expect(filterButton).toBeVisible({ timeout: 20000 });

  // Click to open filter
  await filterButton.click();
  await page.waitForTimeout(1500); // allow animation
  await expect(filterButton).toHaveScreenshot('filter-panel-open.png');

  // Click again to close filter
  await filterButton.click();
  await page.waitForTimeout(1500); // allow close animation
  await expect(filterButton).toHaveScreenshot('filter-panel-closed.png');
});
