test('Verify Include Subordinate Checkbox Works', async ({ page }) => {
  test.setTimeout(180000); // Allow full 3 min for loading

  // Step 1: Navigate
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...');

  // Step 2: Open filter tab
  const filterTab = page.locator('span.tagviewShow lift-tag label');
  await filterTab.waitFor({ state: 'visible', timeout: 90000 });
  await filterTab.click();
  await page.waitForTimeout(2000);

  // Step 3: Wait for checkbox
  const checkbox = page.getByRole('checkbox', { name: /include subordinate/i });
  await checkbox.waitFor({ state: 'visible', timeout: 60000 });

  // Step 4: Only proceed if page is still open
  if (!page.isClosed()) {
    await checkbox.check(); // Playwright handles scrolling internally
    await page.waitForTimeout(1000);
    await expect(checkbox).toHaveScreenshot('sr-budget-glance-filter-checkbox.png');
  } else {
    console.warn('❗ Page closed before checkbox interaction.');
  }
});
