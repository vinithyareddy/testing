test('Verify Table Icon', async ({ page }) => {
  await page.waitForTimeout(3000);

  // Locate the specific widget
  const widget = page.locator('GeneralExp >> div >> div >> div:nth-child(2) >> div:nth-child(3) >> app-othermatters');

  // Wait for widget to be visible and scroll it into view
  await widget.waitFor({ state: 'visible', timeout: 12000 });
  await widget.scrollIntoViewIfNeeded();

  // Now locate the table icon specifically within this widget
  const tableIcon = widget.locator('button.mat-button-toggle[aria-label="table"]');

  // Wait for it to be attached and optionally visible
  await tableIcon.waitFor({ state: 'attached', timeout: 12000 });
  await expect(tableIcon).toBeVisible();

  // Screenshot before clicking
  await expect(tableIcon).toHaveScreenshot('qa-dashboard-other-management-attention-widget-table-icon-visible.png');

  // Click it
  await tableIcon.click();

  // Wait and take screenshot after click
  await page.waitForTimeout(3000);
  await expect(widget).toHaveScreenshot('qa-dashboard-other-management-attention-widget-table-tab-data.png');
});
