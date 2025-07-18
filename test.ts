test('Close Filter Tab', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  // Click Filter Tab (Top Right Pill)
  const filterTab = page.locator('span.tagviewShow lift-tag div label div');
  await filterTab.waitFor({ state: 'visible', timeout: 90000 });
  await filterTab.click();

  // Ensure Filter Panel Slide Opens Fully
  await page.waitForTimeout(4000);

  // More RELIABLE close icon locator using role and visible text match fallback
  const closeIcon = page.locator('app-budget-refiner i.fa-times');

  // Wait and take screenshot BEFORE clicking close
  await closeIcon.waitFor({ state: 'visible', timeout: 60000 });
  await closeIcon.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'screenshots/sr-budget-glance-filter-close.png', fullPage: true });

  // Click close icon
  await closeIcon.click();
  await page.waitForTimeout(3000);

  // Optional: Verify the filter panel is now hidden
  await expect(closeIcon).toHaveCount(0); // or check for 'not visible'
});
