test('Check title of Uses by Fund Group (YTD)', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  const title = page.locator('#Dashboard > div > div > div:nth-child(3) > div > app-uses-breakdown > div > div > div > div.ng-tns-c244-2.ng-trigger.ng-trigger-collapse > div:nth-child(2) > div.col-md-6.pr-0.ng-tns-c244-2 > div > div.row.mt-2.ng-tns-c244-2.ng-star-inserted > div.col-md-8.widget-heading.pl-4.pr-0.ng-tns-c244-2.ng-star-inserted');
  await expect(title).toBeVisible();
  await expect(title).toHaveScreenshot('uses-breakdown-uses-title.png');
});

test('Click on Uses tab', async ({ page }) => {
  const usesTab = page.locator('#mat-button-toggle-2');
  await usesTab.scrollIntoViewIfNeeded();
  await usesTab.click();
  await expect(usesTab).toHaveScreenshot('uses-breakdown-uses-tab.png');
});

test('Click on Sources tab', async ({ page }) => {
  const sourcesTab = page.locator('#mat-button-toggle-3');
  await sourcesTab.scrollIntoViewIfNeeded();
  await sourcesTab.click();
  await expect(sourcesTab).toHaveScreenshot('uses-breakdown-sources-tab.png');
});

test('Check Uses graph is visible', async ({ page }) => {
  const usesTab = page.locator('#mat-button-toggle-2');
  await usesTab.click();
  const graph = page.locator('#highcharts-91nbeyi-441 > svg > rect.highcharts-background');
  await expect(graph).toBeVisible();
  await expect(graph).toHaveScreenshot('uses-breakdown-uses-graph.png');
});

test('Check Sources graph is visible', async ({ page }) => {
  const sourcesTab = page.locator('#mat-button-toggle-3');
  await sourcesTab.click();
  const graph = page.locator('#Dashboard > div > div > div:nth-child(3) > div > app-uses-breakdown > div > div > div > div.ng-tns-c244-2.ng-trigger.ng-trigger-collapse > div:nth-child(2) > div.col-md-6.pr-0.ng-tns-c244-2 > div > div:nth-child(2)');
  await expect(graph).toBeVisible();
  await expect(graph).toHaveScreenshot('uses-breakdown-sources-graph.png');
});

test('Check Uses graph in M and K currency', async ({ page }) => {
  const toggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > span');
  const usesTab = page.locator('#mat-button-toggle-2');
  await usesTab.click();

  await toggle.click(); // switch to K
  await expect(usesTab).toHaveScreenshot('uses-breakdown-uses-k-currency.png');

  await toggle.click(); // switch back to M
  await expect(usesTab).toHaveScreenshot('uses-breakdown-uses-m-currency.png');
});

test('Check Sources graph in M and K currency', async ({ page }) => {
  const toggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > span');
  const sourcesTab = page.locator('#mat-button-toggle-3');
  await sourcesTab.click();

  await toggle.click(); // switch to K
  await expect(sourcesTab).toHaveScreenshot('uses-breakdown-sources-k-currency.png');

  await toggle.click(); // switch back to M
  await expect(sourcesTab).toHaveScreenshot('uses-breakdown-sources-m-currency.png');
});
