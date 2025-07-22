test.describe('TRS Missing Time Widget', () => {

  test('Verify Widget Title', async ({ page }) => {
    const title = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div:nth-child(1) > div.col-sm-9 > div:nth-child(1)');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveScreenshot('trs-missing-title.png');
  });

  test('Verify Time Icon', async ({ page }) => {
    const timeIcon = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div:nth-child(1) > div.col-sm-3 > img');
    await expect(timeIcon).toBeVisible({ timeout: 10000 });
    await expect(timeIcon).toHaveScreenshot('trs-missing-time-icon.png');
  });

  test('Verify Open Months Label', async ({ page }) => {
    const openMonths = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div.row.tile-widget-bottomtext > div.col-sm-4.col-md-4.pr-0 > div:nth-child(1)');
    await expect(openMonths).toBeVisible({ timeout: 10000 });
    await expect(openMonths).toHaveScreenshot('trs-missing-open-months.png');
  });

  test('Verify Closing Months Label', async ({ page }) => {
    const closingMonths = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div.row.tile-widget-bottomtext > div.col-sm-4.col-md-4.pr-0 > div:nth-child(2)');
    await expect(closingMonths).toBeVisible({ timeout: 10000 });
    await expect(closingMonths).toHaveScreenshot('trs-missing-closing-months.png');
  });

  test('Verify Closed Months Label', async ({ page }) => {
    const closedMonths = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div.row.tile-widget-bottomtext > div.col-sm-4.col-md-4.pr-0 > div:nth-child(3)');
    await expect(closedMonths).toBeVisible({ timeout: 10000 });
    await expect(closedMonths).toHaveScreenshot('trs-missing-closed-months.png');
  });

  test('Verify Amount Section', async ({ page }) => {
    const amount = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div.row.mt-1.budget-box-h3 > div.col-md-8.pl-0.pr-0 > div > div.col-md-4.pl-0.pr-2');
    await expect(amount).toBeVisible({ timeout: 10000 });
    await expect(amount).toHaveScreenshot('trs-missing-amount.png');
  });

  test('Verify Hours Section', async ({ page }) => {
    const hours = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div.row.mt-1.budget-box-h3 > div.col-md-8.pl-0.pr-0 > div > div:nth-child(2)');
    await expect(hours).toBeVisible({ timeout: 10000 });
    await expect(hours).toHaveScreenshot('trs-missing-hours.png');
  });

  test('Verify Hours(%) Section', async ({ page }) => {
    const hoursPercent = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div.row.mt-1.budget-box-h3 > div.col-md-8.pl-0.pr-0 > div > div:nth-child(3)');
    await expect(hoursPercent).toBeVisible({ timeout: 10000 });
    await expect(hoursPercent).toHaveScreenshot('trs-missing-hours-percent.png');
  });

  test('Verify All Values Together', async ({ page }) => {
    const allValues = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(2) > div > div.row.tile-widget-bottomtext > div.col-sm-8.col-md-8.pl-0.pr-1 > div');
    await expect(allValues).toBeVisible({ timeout: 10000 });
    await expect(allValues).toHaveScreenshot('trs-missing-all-values.png');
  });

});
