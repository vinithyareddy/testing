test('Check Uses graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();

  const usesTab = page.locator('#mat-button-toggle-2');
  await usesTab.click();

  // Updated: Target a stable class used in all highcharts containers
  const graph = widget.locator('div.highcharts-container');

  await expect(graph).toBeVisible({ timeout: 10000 });
  await expect(graph).toHaveScreenshot('sr-uses-by-fund-grp-uses-graph.png');
});
