test('Verify Filter button opens and closes filter panel', async ({ page }) => {
  const filterButton = page.getByRole('button', { name: 'Filter' });

  await expect(filterButton).toBeVisible({ timeout: 10000 });
  await filterButton.click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveScreenshot('filter-panel-open.png');

  // Click again to close the panel (assuming same button or close icon is used)
  await filterButton.click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveScreenshot('filter-panel-closed.png');
});
