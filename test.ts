test('Verify Bar Graph is Visible in Menu Tab', async ({ page }) => {
  const graph = page.locator('#Dashboard app-final-plans-fundgroup .ng-trigger-collapse');
  await expect(graph).toBeVisible({ timeout: 10000 });

  // Wait for chart data like a bar or label to appear
  const bar = graph.locator('text, .bar, .apexcharts-bar, .highcharts-point').first(); // customize based on your chart lib
  await expect(bar).toBeVisible({ timeout: 10000 });

  await expect(graph).toHaveScreenshot('sr-fp-vs-actual-fundgroup-graph-visible.png');
});
