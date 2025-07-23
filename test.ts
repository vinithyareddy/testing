test('Verify Graph Tab Button (Menu Tab)', async ({ page }) => {
  // Make sure full page and widget area is loaded
  await page.waitForSelector('#Dashboard', { timeout: 15000 });

  const widget = page.locator('app-time-in-error');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Use unique selector for tab
  const menuTab = page.locator('button#mat-button-toggle-150-button');
  await expect(menuTab).toBeVisible({ timeout: 10000 });

  await menuTab.click();

  // Validate that graph is rendered
  const graph = widget.locator('.inner-cart-box'); // based on DOM
  await expect(graph).toBeVisible({ timeout: 10000 });

  await expect(widget).toHaveScreenshot('sr-trs-overview-time-in-error-menu-tab.png');
});
