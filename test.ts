test.describe('TRS Compliance Rate Widget', () => {

  test('Verify Widget Title', async ({ page }) => {
    const title = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(1) > div > div:nth-child(1) > div.col-md-9 > div');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveScreenshot('trs-compliance-widget-title.png');
  });

  test('Verify Time Icon', async ({ page }) => {
    const timeIcon = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(1) > div > div:nth-child(1) > div.col-md-3 > img');
    await expect(timeIcon).toBeVisible({ timeout: 10000 });
    await expect(timeIcon).toHaveScreenshot('trs-compliance-time-icon.png');
  });

  test('Verify Missing Hours Text', async ({ page }) => {
    const missingHours = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(1) > div > div:nth-child(2) > div.col-sm-8 > div.budget-box-h2.mt-1');
    await expect(missingHours).toBeVisible({ timeout: 10000 });
    await expect(missingHours).toHaveScreenshot('trs-compliance-missing-hours-text.png');
  });

  test('Verify Note Text "Please note that April..."', async ({ page }) => {
    const note = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(1) > div > div:nth-child(2) > div.col-sm-8 > div.font-italic.note.mt-2');
    await expect(note).toBeVisible({ timeout: 10000 });
    await expect(note).toHaveScreenshot('trs-compliance-note-text.png');
  });

  test('Verify Bar Chart Showing 100%', async ({ page }) => {
    const chart = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > div > div.row.mt-3 > div > app-trs-top-header-widgets > div > div:nth-child(1) > div > div:nth-child(2) > div.col-sm-4.pl-0.margin > highcharts-chart');
    await expect(chart).toBeVisible({ timeout: 10000 });
    await expect(chart).toHaveScreenshot('trs-compliance-bar-chart.png');
  });

});
