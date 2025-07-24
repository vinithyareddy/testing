test('verify view more - table', async ({ page }) => {
  // Locate the entire WPA card/widget first
  const widget = page.locator('div.budget-box-chart.ng-star-inserted:has-text("WPA Allocations Outside VPU")');

  // Wait for widget to appear
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Locate the actual View More button inside the widget using class or text fallback
  const viewMore = page.locator('div.viewmore.pointer.mt-3.pt-2.ng-star-inserted');

  // Wait for the button to appear and interact
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await viewMore.click();

  // Wait for the expanded table to appear (from new screen with grid)
  const table = page.locator('div.ag-root.ag-unselectable.ag-layout-normal');

  await page.waitForTimeout(2000); // Let navigation/render happen

  await expect(table).toBeVisible({ timeout: 15000 });

  // Screenshot of the loaded table
  await expect(table).toHaveScreenshot('sr-fp-vs-actual-wpa-allocations-view-more-table-visible.png');
});
