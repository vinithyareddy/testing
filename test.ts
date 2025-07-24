test('verify view more - table', async ({ page }) => {
  const widget = page.locator('div.budget-box-chart.ng-star-inserted:has-text("WPA Allocations Outside VPU")');
  await expect(widget).toBeVisible({ timeout: 10000 });
  const viewMore = page.locator('div.viewmore.pointer.mt-3.pt-2.ng-star-inserted');
  await expect(viewMore).toBeVisible({ timeout: 10000 });
  await viewMore.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await viewMore.click();
  const table = page.locator('div.ag-root.ag-unselectable.ag-layout-normal');
  await page.waitForTimeout(2000); 
  await expect(table).toBeVisible({ timeout: 15000 });
  await expect(table).toHaveScreenshot('sr-fp-vs-actual-wpa-allocations-view-more-table-visible.png');
});
