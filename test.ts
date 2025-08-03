test('Verify Table Icon', async ({ page }) => {
  await page.waitForTimeout(3000);

  const widget = page.locator('GeneralExp > div > div > div:nth-child(2) > div:nth-child(3) > app-othermatters');
  await widget.waitFor({ state: 'visible', timeout: 120000 });
  await widget.scrollIntoViewIfNeeded();

  // Scoped and flexible selector for the table icon button inside the widget
  const tableIcon = widget.locator('button[class*="mat-button-toggle"]');

  // Wait for the button to be attached (not just visible)
  await tableIcon.waitFor({ state: 'attached', timeout: 12000 });

  // Optional: ensure it’s visible
  await expect(tableIcon).toBeVisible();

  // Screenshot of the visible state before clicking
  await expect(tableIcon).toHaveScreenshot('qa-dashboard-other-management-attention-widget-table-icon-visible.png');

  await tableIcon.click();
  await page.waitForTimeout(3000);

  // Screenshot after clicking to verify data tab opened
  await expect(widget).toHaveScreenshot('qa-dashboard-other-management-attention-widget-table-tab-data.png');
});
