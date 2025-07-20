test('Check Sources graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();

  const sourcesTab = page.locator('#mat-button-toggle-3');
  await sourcesTab.click();

  const graph = widget.locator('div.chart-sources'); // use a stable class if available

  await expect(graph).toBeVisible({ timeout: 10000 });
  await expect(graph).toHaveScreenshot('uses-breakdown-sources-graph.png');
});


test('Check S&U graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();

  const suTab = page.getByRole('tab', { name: 'S&U' });
  await expect(suTab).toBeVisible({ timeout: 10000 });
  await suTab.click();
  await page.waitForTimeout(500);

  const graph = widget.locator('div.highcharts-container').nth(1);
  await expect(graph).toBeVisible({ timeout: 10000 });
  await expect(graph).toHaveScreenshot('sr-fixed-vs-variable-su-graph.png');
});
