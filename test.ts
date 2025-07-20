test('Check KPIs block 1 (FY24 Actual, FY25 Forecast, Difference)', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown >> nth=0');
  await widget.scrollIntoViewIfNeeded();

  const fy24 = page.getByText('FY24 Actual', { exact: false });
  const fy25 = page.getByText('FY25 Forecast', { exact: false });
  const diff = page.getByText('Difference', { exact: false });

  await expect(fy24).toBeVisible();
  await expect(fy25).toBeVisible();
  await expect(diff).toBeVisible();

  await expect(fy24).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-fy24-actual.png');
  await expect(fy25).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-fy25-forecast.png');
  await expect(diff).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-difference.png');
});
