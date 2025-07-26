test('Verify Filters Summary Bar is visible and take screenshot', async ({ page }) => {
  await page.waitForTimeout(2000); // give time for data to load

  const filterSummaryBar = page.locator('[class*="banner-align-p-0"]');
  await expect(filterSummaryBar).toBeVisible({ timeout: 15000 });

  await filterSummaryBar.screenshot({ path: 'sr-budget-expenses-filter-summary-bar-open.png' });
});
