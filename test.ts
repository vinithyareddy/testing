test('Verify Graph Tab Button (Menu Tab)', async ({ page }) => {
  // Wait for page and dashboard to be fully rendered
  await page.waitForSelector('#Dashboard', { timeout: 15000 });

  // Scope inside Time in Error widget
  const widget = page.locator('app-time-in-error');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Select the 📊 menu button inside the toggle group (avoid dynamic IDs)
  const menuTab = widget.locator('button.mat-button-toggle-button').filter({
    has: page.locator('span.mat-button-toggle-label-content'),
  });

  await expect(menuTab.first()).toBeVisible({ timeout: 10000 });
  await menuTab.first().click();

  // Wait for the chart SVG to render (Highcharts SVG element)
  const chart = widget.locator('svg.highcharts-root');
  await expect(chart).toBeVisible({ timeout: 10000 });

  // Screenshot the widget after graph renders
  await expect(widget).toHaveScreenshot('sr-trs-overview-time-in-error-menu-tab.png');
});
