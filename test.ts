test('Verify default filter selections in filter summary bar', async ({ page }) => {
  const filterButton = page.getByRole('button', { name: /filter/i });
  await filterButton.click();
  await page.waitForTimeout(1000); // wait for dropdown animation

  // Wait for fiscal year label to appear
  await page.waitForSelector('text=Fiscal Year', { timeout: 10000 });

  // Check visible values
  const fiscalYearTag = page.getByText('2025', { exact: false });
  await expect(fiscalYearTag).toBeVisible({ timeout: 10000 });

  const vpuTag = page.getByText('ITSVP', { exact: false });
  await expect(vpuTag).toBeVisible({ timeout: 10000 });

  const includeUnitTag = page.getByText('N', { exact: true }); // or more specific if needed
  await expect(includeUnitTag).toBeVisible({ timeout: 10000 });

  // Posting period: look for months (less brittle)
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  for (const month of months) {
    await expect(page.getByText(month)).toBeVisible({ timeout: 10000 });
  }

  // Screenshot
  await expect(page.locator('div')).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});
