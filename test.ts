test('Check F&V graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();

  const fvTab = page.locator('#mat-button-toggle-0'); // or use correct F&V toggle selector
  await fvTab.click();

  const chart = widget.locator('div.highcharts-container').nth(1); // second graph
  await expect(chart).toBeVisible({ timeout: 10000 });

  await expect(chart).toHaveScreenshot('sr-fixed-vs-variable-fv-graph.png');
});
