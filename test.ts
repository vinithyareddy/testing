test('Close Filter Tab', async ({ page }) => {
  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  const filterTab = page.locator('div.tag-btn', { hasText: 'Filter' });
  await expect(filterTab).toBeVisible({ timeout: 15000 });
  await filterTab.click();

  const closeIcon = page.locator('app-budget-refiner i.fa-times');
  await expect(closeIcon).toBeVisible({ timeout: 20000 });

  await closeIcon.scrollIntoViewIfNeeded();
  await expect(closeIcon).toHaveScreenshot('sr-sources-uses-filter-close.png');

  await closeIcon.click();
});
