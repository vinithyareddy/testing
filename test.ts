test('Check S&U graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();

  const suTab = page.getByRole('tab', { name: 'S&U' });
  await suTab.click();

  // Select the second highcharts container inside the widget
  const graph = widget.locator('div.highcharts-container').nth(1);

  await expect(graph).toBeVisible({ timeout: 10000 });
  await expect(graph).toHaveScreenshot('sr-fixed-vs-variable-su-graph.png');
});
