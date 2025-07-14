test('Verify default filter selections in filter summary bar', async ({ page }) => {
  test.setTimeout(90000);

  await expect(page).toHaveTitle(/Budget at a Glance/i);

  const filterButton = page.locator('div.item-title-text.flex-grow-1');
  await expect(filterButton).toBeVisible({ timeout: 15000 });

  await filterButton.click();
  await page.waitForTimeout(1500); // let filters load

  await page.waitForSelector('text=Fiscal Year', { timeout: 20000 });

  const fiscalYearTag = page.getByText('2025').nth(1);
  await expect(fiscalYearTag).toBeVisible();
  await fiscalYearTag.scrollIntoViewIfNeeded();

  const vpuTag = page.getByText('TISVP', { exact: false });
  await expect(vpuTag).toBeVisible({ timeout: 10000 });
  await vpuTag.scrollIntoViewIfNeeded();

  const includeUnitTag = page.getByText('N').nth(3);
  await expect(includeUnitTag).toBeVisible();
  await includeUnitTag.scrollIntoViewIfNeeded();

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  for (const month of months) {
    const monthTag = page.getByText(month).nth(0);
    await expect(monthTag).toBeVisible();
    await monthTag.scrollIntoViewIfNeeded();
  }

  const filterSection = page.locator('app-budget-banner-section');
  await expect(filterSection).toBeVisible();
  await filterSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(filterSection).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});
