test('Open Filter Tab', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaq.worldbank.org/...');

  await page.waitForLoadState('networkidle');

  await expect(page.locator('text=WPA Expenditure Summary').first()).toBeVisible();

  const filterTab = page.locator('div.tag-btn', { hasText: 'Filter' });

  await filterTab.waitFor({ state: 'visible', timeout: 10000 });

  await filterTab.click();

  await page.waitForTimeout(2000); // wait for dropdown to open

  await expect(filterTab).toHaveScreenshot('sr-budget-expenses-filter-tab.png');
});
