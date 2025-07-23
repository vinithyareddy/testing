test('Verify Graph Tab Button (Menu Tab)', async ({ page }) => {
  await page.goto('<your_url>');
  await page.waitForSelector('#Dashboard', { timeout: 15000 });

  const widget = page.locator('app-time-in-error');
  await expect(widget).toBeVisible();

  // Use role or aria-label
  const menuTab = page.getByRole('button', { name: 'T' });
  await expect(menuTab).toBeVisible();
  await menuTab.click();

  // Graph inside the widget
  const graph = widget.locator('svg.highcharts-root');
  await expect(graph).toBeVisible();

  await expect(widget).toHaveScreenshot('sr-trs-overview-time-in-error-menu-tab.png');
});
