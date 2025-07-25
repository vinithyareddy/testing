test('Verify Filters Summary Bar displays correct tags', async ({ page }) => {
  // Wait for page to load completely
  await page.goto('https://standardreportsbeta.worldbank.org/...');

  // Wait for the banner section with filters
  const filtersSummaryBar = page.locator('div.app-budget-banner-section .lift-accordion-item');
  await expect(filtersSummaryBar).toBeVisible({ timeout: 10000 });

  // Optional: check a specific tag
  await expect(page.getByText('Cost Obj Responsible VPU')).toBeVisible();

  // Take a screenshot for validation
  await filtersSummaryBar.screenshot({ path: 'sr-wpa-filters-summary-bar.png' });
});
