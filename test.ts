test('Fixed Expenses bar graph is visible', async ({ page }) => {
  const chartHeader = page.locator('text=Fixed Expenses: Actuals Vs Forecast').first();
  await chartHeader.scrollIntoViewIfNeeded();
  await expect(chartHeader).toBeVisible({ timeout: 10000 });

  // Grab chart near the header — get only the first matching chart to avoid strict mode violation
  const chart = chartHeader.locator('..').locator('..').locator('div:has(svg.highcharts-root)').first();
  await expect(chart).toBeVisible({ timeout: 10000 });

  // Take screenshot
  await expect(chart).toHaveScreenshot('sr-sources-uses-breakdown-fixed-expenses-bar-graph.png', {
    animations: 'disabled',
  });
});
