test('Check F&V graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();

  const fvTab = page.getByRole('tab', { name: 'F&V' });
  await fvTab.click();

  const graph = widget.locator('div.chart-fv'); // scoped to widget

  await expect(graph).toBeVisible({ timeout: 10000 });
  await expect(graph).toHaveScreenshot('sr-fixed-vs-variable-fv-graph.png');
});
