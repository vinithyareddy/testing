test('Variable Expenses bar graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown').nth(0);
  await widget.scrollIntoViewIfNeeded();

  const chart = widget.locator('highcharts-chart');
  await expect(chart).toBeVisible({ timeout: 10000 });

  await expect(chart).toHaveScreenshot('sr-sources-uses-variable-expenses-bar-graph.png');
});
