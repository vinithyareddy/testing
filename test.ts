test('Open Filter Tab', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('your-full-url'); // if needed, navigate explicitly

  await page.waitForLoadState('networkidle');
  await expect(page.locator('text=WPA Expenditure Summary')).toBeVisible();

  const filterTab = page.getByRole('button', { name: 'Filter' });

  await expect(filterTab).toBeVisible({ timeout: 10000 });
  await filterTab.click({ force: true });

  await page.waitForTimeout(2000); // allow for dropdown expand
  await expect(filterTab).toHaveScreenshot('sr-budget-expenses-filter-tab.png');
});
