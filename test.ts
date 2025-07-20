test('Check KPIs block 1 (FY24 Actual, FY25 Forecast, Difference)', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown >> nth=0');
  await widget.scrollIntoViewIfNeeded();

  const fy24 = page.locator('#Dashboard > div > div > div:nth-child(3) > div > app-uses-breakdown > div > div > div > div.ng-tns-c244-2.ng-trigger.ng-trigger-collapse > div.row.pl-0.pr-0.ng-tns-c244-2.ng-star-inserted > div.col-md-6.pr-0.pt-4.ng-tns-c244-2 > div > div:nth-child(2) > div:nth-child(1) > p');
  const fy25 = page.locator('#Dashboard > div > div > div:nth-child(3) > div > app-uses-breakdown > div > div > div > div.ng-tns-c244-2.ng-trigger.ng-trigger-collapse > div.row.pl-0.pr-0.ng-tns-c244-2.ng-star-inserted > div.col-md-6.pr-0.pt-4.ng-tns-c244-2 > div > div:nth-child(2) > div:nth-child(2) > p');
  const diff = page.locator('#Dashboard > div > div > div:nth-child(3) > div > app-uses-breakdown > div > div > div > div.ng-tns-c244-2.ng-trigger.ng-trigger-collapse > div.row.pl-0.pr-0.ng-tns-c244-2.ng-star-inserted > div.col-md-6.pr-0.pt-4.ng-tns-c244-2 > div > div:nth-child(2) > div.col-md-4.br-left-right.pt-2.ng-tns-c244-2 > p');

  await expect(fy24).toBeVisible();
  await expect(fy25).toBeVisible();
  await expect(diff).toBeVisible();

  await expect(fy24).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-fy24-actual.png');
  await expect(fy25).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-fy25-forecast.png');
  await expect(diff).toHaveScreenshot('sr-sources-uses-fixed-expenses-kpi-diff.png');
});
