test('Verify Expand Icon in Widget', async ({ page }) => {
  // Wait until the Dashboard is fully loaded
  await page.waitForSelector('#Dashboard', { timeout: 15000 });

  // Locate the Time in Error widget container
  const widget = page.locator('app-time-in-error');

  await expect(widget).toBeVisible({ timeout: 10000 });

  // Wait specifically for the expand icon to appear within the widget
  const expandIcon = widget.locator('img[src*="arrow_down.png"]'); // safer than deep nth-child

  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Screenshot only when icon is confirmed visible
  await expect(expandIcon).toHaveScreenshot('sr-trs-overview-time-in-error-expand-icon.png');
});
