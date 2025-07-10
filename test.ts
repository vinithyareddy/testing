test('Verify "Data as of" text is visible (dynamic date)', async ({ page }) => {
  const dataAsOf = page.locator('app-budget-glance >> text=/Data as of/');
  await expect(dataAsOf).toBeVisible();
  await expect(dataAsOf).toContainText('Data as of');
  await expect(dataAsOf).toHaveScreenshot('sr-budget-glance-data-as-of-visible.png');
});

test('Verify FY Time Elapsed 100% progress bar is visible', async ({ page }) => {
  const fyProgress = page.locator('div.progress-bar.bg-primary'); // Assuming default Bootstrap classes
  await expect(fyProgress).toBeVisible();
  await expect(fyProgress).toHaveScreenshot('sr-budget-glance-fy-progress-bar.png');
});
test('Verify Currency Toggle (5M / $K) is present', async ({ page }) => {
  const toggle5M = page.locator('text=5M');
  const toggleK = page.locator('text=K');
  await expect(toggle5M).toBeVisible();
  await expect(toggleK).toBeVisible();
  await expect(toggle5M).toHaveScreenshot('sr-budget-glance-currency-toggle-5m.png');
});
test('Verify Filter button is visible and clickable', async ({ page }) => {
  const filterBtn = page.getByRole('button', { name: 'Filter' });
  await expect(filterBtn).toBeVisible();
  await filterBtn.click();
  await page.waitForTimeout(500);
  await expect(filterBtn).toHaveScreenshot('sr-budget-glance-filter-button-click.png');
});
test('Verify Filters Summary Bar displays correct tags', async ({ page }) => {
  const filtersBar = page.locator('text=Fiscal Year').first(); // start with "Fiscal Year (1)"
  await expect(filtersBar).toBeVisible();
  await expect(filtersBar).toHaveScreenshot('sr-budget-glance-filters-summary-bar.png');
});
test('Verify Filter Dropdown Shows Expected Options', async ({ page }) => {
  const filterButton = page.getByRole('button', { name: 'Filter' });
  await filterButton.click();
  await page.waitForTimeout(500);

  await expect(page.locator('text=Fiscal Year')).toBeVisible();
  await expect(page.locator('text=VPU')).toBeVisible();
  await expect(page.locator('text=Include HIS Unit')).toBeVisible();
  await expect(page.locator('text=Posting Period')).toBeVisible();

  await expect(page.locator('div.filters-wrapper')).toHaveScreenshot('sr-budget-glance-filter-dropdown-options.png');
});
test('Verify default filter selections in filter summary bar', async ({ page }) => {
  // Fiscal Year should be 2025
  const fiscalYearTag = page.locator('text=FISCAL YEAR: 2025');
  await expect(fiscalYearTag).toBeVisible();

  // VPU should be ITSVP
  const vpuTag = page.locator('text=VPU: ITSVP');
  await expect(vpuTag).toBeVisible();

  // Include HIS Unit should be N
  const includeUnitTag = page.locator('text=INCLUDE HIS UNIT: N');
  await expect(includeUnitTag).toBeVisible();

  // Posting Period should have all 12 months selected
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  for (const month of months) {
      await expect(page.locator(`text=${month}`)).toBeVisible();
  }

  await expect(page.locator('div.filters-summary')).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});
test('Reset filters and verify default tags', async ({ page }) => {
  // Step 1: Open the Filter tab
  const filterTab = page.locator('button:has-text("Filter")');
  await filterTab.click();

  // Step 2: Click the Reset button (visible inside dropdown)
  const resetButton = page.locator('button:has-text("Reset")');
  await expect(resetButton).toBeVisible();
  await resetButton.click();

  // Step 3: Click Apply (if needed)
  const applyButton = page.locator('button:has-text("Apply")');
  if (await applyButton.isVisible()) {
      await applyButton.click();
  }

  // Step 4: Validate default filter summary
  await expect(page.locator('text=FISCAL YEAR: 2025')).toBeVisible();
  await expect(page.locator('text=VPU: ITSVP')).toBeVisible();
  await expect(page.locator('text=INCLUDE HIS UNIT: N')).toBeVisible();
  await expect(page.locator('text=Jul')).toBeVisible(); // Checking one month is enough
  await expect(page.locator('div.filters-summary')).toHaveScreenshot('sr-budget-glance-filter-reset-defaults.png');
});
