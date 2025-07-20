test('Fixed Expenses widget is visible', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown >> nth=0');
  await expect(widget).toBeVisible();
  await expect(widget).toHaveScreenshot('sr-sources-uses-fixed-expenses-widget.png');
});

test('Fixed Expenses title is visible', async ({ page }) => {
  const title = page.locator('text=Fixed Expenses: Actuals Vs Forecast');
  await expect(title).toBeVisible();
  await expect(title).toHaveScreenshot('sr-sources-uses-fixed-expenses-title.png');
});

test('Check KPIs block 1 (FY24 Actual, FY25 Forecast, Difference)', async ({ page }) => {
  const fy24 = page.locator('text=FY24 Actual');
  const fy25 = page.locator('text=FY25 Forecast');
  const diff1 = page.locator('text=Difference');

  await expect(fy24).toBeVisible();
  await expect(fy25).toBeVisible();
  await expect(diff1).toBeVisible();

  await expect(fy24).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-fy24-actual.png');
  await expect(fy25).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-fy25-forecast.png');
  await expect(diff1).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-diff-forecast.png');
});

test('Check KPIs block 2 (FY24 Actual YTD, FY25 Actual YTD, Difference)', async ({ page }) => {
  const ytd24 = page.locator('text=FY24 Actual YTD');
  const ytd25 = page.locator('text=FY25 Actual YTD');
  const diff2 = page.locator('text=Difference');

  await expect(ytd24).toBeVisible();
  await expect(ytd25).toBeVisible();
  await expect(diff2).toBeVisible();

  await expect(ytd24).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-fy24-actual-ytd.png');
  await expect(ytd25).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-fy25-actual-ytd.png');
  await expect(diff2).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-diff-ytd.png');
});

test('Fixed Expenses bar graph is visible', async ({ page }) => {
  const graph = page.locator('app-uses-breakdown highcharts-chart');
  await expect(graph).toBeVisible();
  await expect(graph).toHaveScreenshot('sr-sources-uses-fixed-expenses-bar-graph.png');
});

test('Legends are visible: BB, REIMB, TF, Forecast', async ({ page }) => {
  const legendBB = page.locator('text=BB');
  const legendREIMB = page.locator('text=REIMB');
  const legendTF = page.locator('text=TF');
  const legendForecast = page.locator('text=Forecast');

  await expect(legendBB).toBeVisible();
  await expect(legendREIMB).toBeVisible();
  await expect(legendTF).toBeVisible();
  await expect(legendForecast).toBeVisible();

  await expect(legendBB).toHaveScreenshot('sr-sources-uses-fixed-expenses-legend-bb.png');
  await expect(legendREIMB).toHaveScreenshot('sr-sources-uses-fixed-expenses-legend-reimb.png');
  await expect(legendTF).toHaveScreenshot('sr-sources-uses-fixed-expenses-legend-tf.png');
  await expect(legendForecast).toHaveScreenshot('sr-sources-uses-fixed-expenses-legend-forecast.png');
});
