test('Verify Table Icon', async ({ page }) => {
  await page.waitForTimeout(3000);

  // Locate the widget container
  const widget = page.locator('GeneralExp >> div >> div >> div:nth-child(2) >> div:nth-child(3) >> app-othermatters');

  await widget.waitFor({ state: 'visible', timeout: 12000 });
  await widget.scrollIntoViewIfNeeded();

  // 🔧 Fixed: Traverse inside any nested divs and find matching button
  const tableIcon = widget.locator('div >> button[class*="mat-button-toggle"][class*="focus-indicator"]');

  // Wait for it to attach and be visible
  await tableIcon.waitFor({ state: 'attached', timeout: 12000 });
  await expect(tableIcon).toBeVisible();

  // Screenshot before click
  await expect(tableIcon).toHaveScreenshot('qa-dashboard-other-management-attention-widget-table-icon-visible.png');

  // Click and wait
  await tableIcon.click();
  await page.waitForTimeout(3000);

  // Final snapshot
  await expect(widget).toHaveScreenshot('qa-dashboard-other-management-attention-widget-table-tab-data.png');
});
