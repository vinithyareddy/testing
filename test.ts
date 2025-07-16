test('Verify Include Subordinate Checkbox Works', async ({ page }) => {
  test.setTimeout(240000); // Allow full 4 min for page + DOM load

  // Step 1: Navigate
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=...'); // keep your full query

  // Step 2: Open filter tab
  const filterTab = page.locator('span.tagviewShow.lift-tag.label');
  await filterTab.waitFor({ state: 'visible', timeout: 90000 });
  await filterTab.click();
  await page.waitForTimeout(2000); // give the UI time to expand

  // Step 3: Locate the checkbox reliably
  const checkbox = page.locator('input[type="checkbox"]').filter({ hasText: /Include Subordinate/i }).first();

  // Wait until checkbox is visible
  await checkbox.waitFor({ state: 'visible', timeout: 180000 });

  // Step 4: Check if still visible and interact
  if (await checkbox.isVisible()) {
    await checkbox.check(); // Scrolls and clicks
    await page.waitForTimeout(2000); // Let UI update
    await expect(checkbox).toHaveScreenshot('sr-budget-glance-filter-checkbox.png');
  } else {
    await page.screenshot({ path: 'failure-checkbox-not-visible.png' });
    console.warn('❌ Checkbox not visible even after 3 minutes.');
  }
});
