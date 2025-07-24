test('verify view more - export excel option', async ({ page }) => {
  const widget = page.locator('#Dashboard app-wpa-allocations');
  const viewMore = page.locator('div.viewmore.pointer.mt-3.p-2.ng-star-inserted'); // Specific class-based
  const exportExcel = page.locator('li img[title="Export Excel"]'); // Targeting icon inside list

  await expect(widget).toBeVisible({ timeout: 15000 });
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });
  await viewMore.click();

  await page.waitForLoadState('networkidle'); // Wait for navigation/transition
  await expect(exportExcel).toBeVisible({ timeout: 10000 });
  await expect(exportExcel).toHaveScreenshot('sr-fp-vs-actual-wpa-allocations-view-more-exportexcel-option.png');
});
