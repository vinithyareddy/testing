test('Verify Bar Graph is Visible in Menu Tab', async ({ page }) => {
  const widget = page.locator('app-plans-by-bussiness-process');
  await expect(widget).toBeVisible({ timeout: 15000 });
  const graphContainer = widget.locator('.highcharts-container');
  await expect(graphContainer).toBeVisible({ timeout: 15000 });
  await graphContainer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
});
