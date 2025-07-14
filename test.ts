test('Verify default filter selections in filter summary bar', async ({ page }) => {
  test.setTimeout(90000); // Allow enough time for full loading

  // Step 1: Confirm page title or heading
  await expect(page).toHaveTitle(/Budget-Glance/i);

  // Step 2: Expand filter summary section (accordion/collapsed UI)
  const filterToggle = page.locator('div.item-title-text.flex-grow-1');
  await filterToggle.click();
  await page.waitForTimeout(1500); // Give it time to expand

  // Step 3: Wait for 'Fiscal Year' to be visible
  await page.waitForSelector('text=Fiscal Year', { timeout: 20000 });

  // Step 4: Check each filter tag
  const fiscalYearTag = page.getByText('2025').nth(1);
  await expect(fiscalYearTag).toBeVisible();
  await fiscalYearTag.scrollIntoViewIfNeeded();

  const vpuTag = page.getByText('TISVP', { exact: false });
  await vpuTag.scrollIntoViewIfNeeded();
  await expect(vpuTag).toBeVisible({ timeout: 10000 }); // shorter and safer

  const includeUnitTag = page.getByText('N').nth(3);
  await includeUnitTag.scrollIntoViewIfNeeded();
  await expect(includeUnitTag).toBeVisible();

  // Step 5: Validate all months
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  for (const month of months) {
    const monthTag = page.getByText(month).first(); // .nth(0) == .first()
    await monthTag.scrollIntoViewIfNeeded();
    await expect(monthTag).toBeVisible({ timeout: 10000 });
  }

  // Step 6: Screenshot the entire filter section
  const filterSection = page.locator('app-budget-banner-section');
  await expect(filterSection).toBeVisible({ timeout: 10000 });
  await filterSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // allow stable render
  await expect(filterSection).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});
