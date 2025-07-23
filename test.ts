test('Fixed Expenses bar graph is visible', async ({ page }) => {
  // Wait for expanded content — chart container
  const chartHeader = page.locator('text=Fixed Expenses: Actuals Vs Forecast').first();
  await chartHeader.scrollIntoViewIfNeeded();
  await expect(chartHeader).toBeVisible({ timeout: 10000 });

  // Now grab the chart using its proximity to that header text
  const chart = chartHeader.locator('..').locator('..').locator('div:has(svg.highcharts-root)'); // climb and find SVG chart
  await expect(chart).toBeVisible({ timeout: 10000 });

  // Stable screenshot
  await expect(chart).toHaveScreenshot('sr-sources-uses-fixed-expenses-bar-graph.png', {
    timeout: 10000,
    animations: 'disabled',
  });
});
