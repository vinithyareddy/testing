test('Verify Filters Summary Bar is visible and take screenshot', async ({ page }) => {
  await page.waitForTimeout(1000); // or wait for some key element to load

  const filterSummaryBar = page.locator('div.banner-align-p-0');
  await expect(filterSummaryBar).toBeVisible({ timeout: 10000 });
});
