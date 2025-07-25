test('Verify Filters Summary Bar displays correct tags', async ({ page }) => {
  await page.waitForTimeout(3000); // Wait for filters to load

  const filtersSummaryBar = page.locator('div.app-budget-banner-section >> div.lift-accordion-wrapper >> div.lift-accordion-item');
  await expect(filtersSummaryBar).toBeVisible({ timeout: 10000 });

  // OR fallback:
  await expect(page.getByText('Cost Obj Responsible VPU')).toBeVisible();

  await filtersSummaryBar.screenshot({ path: 'sr-wpa-filters-summary-bar.png' });
});