test('Verify Table Icon, Data Widget, and Table Data Visibility', async ({ page }) => {
  await page.waitForTimeout(3000);
  const tableIcon = page.locator('button.mat-button-toggle'); 
  await tableIcon.waitFor({ state: 'visible', timeout: 120000 });
  await expect(tableIcon).toHaveScreenshot('qa-dashboard-3yr-trend-widget-table-icon-visible.png');
  await tableIcon.click();
  await page.waitForTimeout(1000);
  const dataWidget = page.locator('div.widgetBox'); 
  await dataWidget.waitFor({ state: 'visible', timeout: 10000 });
  await expect(dataWidget).toHaveScreenshot('qa-dashboard-3yr-trend-widget-table-tab-data-widget-visible.png');
  const tableContainer = page.locator('div.col-md-9'); 
  await tableContainer.waitFor({ state: 'visible', timeout: 10000 });
  await expect(tableContainer).toHaveScreenshot('qa-dashboard-3yr-trend-table-tab-dynamic-table-visible.png');
});

test('Verify Top Exceptions By Widget Title', async ({ page }) => {
  await page.waitForTimeout(3000);
  const topExceptionsTitle = page.locator('span.widget-heading:has-text("Top Exceptions By")');
  await topExceptionsTitle.waitFor({ state: 'visible', timeout: 120000 });
  await expect(topExceptionsTitle).toHaveScreenshot('qa-dashboard-top-exceptions-by-widget-title.png');
});


test('Verify Info Icon and Tooltip for Top Exceptions By Widget', async ({ page }) => {
  await page.waitForTimeout(3000);
  const infoIcon = page.locator('i.far.fa-info-circle');
  await infoIcon.waitFor({ state: 'visible', timeout: 120000 });
  await expect(infoIcon).toHaveScreenshot('qa-dashboard-top-exceptions-info-icon.png');
  await infoIcon.click();
  await page.waitForTimeout(1000);
  const tooltip = page.locator('div.popover-container');
  await tooltip.waitFor({ state: 'visible', timeout: 10000 });
  await expect(tooltip).toHaveScreenshot('qa-dashboard-top-exceptions-info-icon-tooltip.png');
  const closeButton = page.locator('span.far.fa-xmark'); 
  await closeButton.click();
  await page.waitForTimeout(500);
});

test('Verify Filter Dropdown in Top Exceptions By Widget', async ({ page }) => {
  await page.waitForTimeout(3000);
  const filterDropdown = page.locator('div.mdc-notched-outline');
  await filterDropdown.waitFor({ state: 'visible', timeout: 120000 });
  await expect(page).toHaveScreenshot('qa-dashboard-top-exceptions-dropdown-visible.png');
  await filterDropdown.click();
  await page.waitForTimeout(2000);
  const fundCenterOption = page.locator('mat-option:has-text("Fund Center")');
  await fundCenterOption.waitFor({ state: 'visible', timeout: 6000 });
  await fundCenterOption.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('qa-dashboard-top-exceptions-selected-fund-center.png');
  await filterDropdown.click();
  await page.waitForTimeout(2000);
  const locationOption = page.locator('mat-option:has-text("Location")');
  await locationOption.waitFor({ state: 'visible', timeout: 6000 });
  await locationOption.click();
  await page.waitForTimeout(1000);
});
