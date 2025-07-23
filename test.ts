test('Fixed Expenses bar graph is visible', async ({ page }) => {
  // Target the entire card area first
  const card = page.locator('app-uses-breakdown >> text=Fixed Expenses: Actuals Vs Forecast').first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible({ timeout: 10000 });

  // Now get the Highcharts container within that card
  const graph = card.locator('div.highcharts-container');
  await expect(graph).toBeVisible({ timeout: 10000 });

  // Take screenshot of just the graph area
  await expect(graph).toHaveScreenshot('sr-sources-uses-fixed-expenses-bar-graph.png', {
    timeout: 10000,
    animations: 'disabled',
  });
});
