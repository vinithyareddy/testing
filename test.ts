test('Check Sources graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();

  const sourcesTab = page.locator('#mat-button-toggle-3');
  await sourcesTab.click();

  const graph = widget.locator('div.chart-sources'); // use a stable class if available

  await expect(graph).toBeVisible({ timeout: 10000 });
  await expect(graph).toHaveScreenshot('uses-breakdown-sources-graph.png');
});
