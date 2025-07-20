test('Check Uses graph is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();

  const usesTab = page.locator('#mat-button-toggle-2');
  await usesTab.click();

  const chart = widget.locator('div.highcharts-container').nth(0); // scoping and indexing
  await expect(chart).toBeVisible({ timeout: 10000 });

  await expect(chart).toHaveScreenshot('sr-uses-by-fund-grp-uses-graph.png');
});
