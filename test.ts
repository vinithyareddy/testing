test('Verify Table Icon, Data Widget, and Table Data Visibility', async ({ page }) => {
  await page.waitForTimeout(6000);
  const tableIcon = page.locator('button.mat-button-toggle'); 
  await tableIcon.waitFor({ state: 'visible', timeout: 120000 });
  await expect(tableIcon).toHaveScreenshot('qa-dashboard-3yr-trend-widget-table-icon-visible.png');
  await tableIcon.click();
  await page.waitForTimeout(3000);
  const dataWidget = page.locator('div.widgetBox'); 
  await dataWidget.waitFor({ state: 'visible', timeout: 10000 });
  await expect(dataWidget).toHaveScreenshot('qa-dashboard-3yr-trend-widget-table-tab-data-widget-visible.png');
  const tableContainer = page.locator('div.col-md-9'); 
  await tableContainer.waitFor({ state: 'visible', timeout: 10000 });
  await expect(tableContainer).toHaveScreenshot('qa-dashboard-3yr-trend-table-tab-dynamic-table-visible.png');
});
