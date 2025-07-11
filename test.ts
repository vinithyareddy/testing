test('Verify default filter selections in filter summary bar', async ({ page }) => {
  test.setTimeout(90000); // Safe timeout for full banner load

  // Click the filter button
  const filterButton = page.locator('lift-accordion-item .item-title-text');
  await filterButton.click();
  await page.waitForTimeout(1000);

  // Wait for the filter summary section to appear
  await page.waitForSelector('text=Fiscal Year', { timeout: 20000 });

  // Check Fiscal Year tag
  const fiscalYearTag = page.getByText('2025').nth(1); // adjust index if needed
  await fiscalYearTag.scrollIntoViewIfNeeded();
  await expect(fiscalYearTag).toBeVisible({ timeout: 10000 });

  // Check VPU tag (TISVP)
  const vpuTag = page.getByText('TISVP').first();
  await vpuTag.scrollIntoViewIfNeeded();
  await expect(vpuTag).toBeVisible({ timeout: 10000 });

  // Check Include Unit tag
  const includeUnitTag = page.getByText('Include Unit').first(); // safer than getByText('N')
  await includeUnitTag.scrollIntoViewIfNeeded();
  await expect(includeUnitTag).toBeVisible({ timeout: 10000 });

  // Check all month tags
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  for (const month of months) {
    const monthTag = page.getByText(month).nth(0); // Use scoped locator if necessary
    await monthTag.scrollIntoViewIfNeeded();
    await expect(monthTag).toBeVisible({ timeout: 10000 });
  }

  // Screenshot of full filter section (use proper selector if available)
  const filterSection = page.locator('app-budget-glance .filter-summary-bar'); // Replace with exact container selector
  await filterSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(filterSection).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});
