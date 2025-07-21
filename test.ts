test('Validate Reports tab UI before clicking report icon', async ({ page }) => {
  // Step 1: Click Reports tab
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  await expect(reportsTab).toHaveScreenshot('01-reports-tab-clicked.png');

  // Step 2: Validate title “Reports”
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const title1 = page.locator('#Reports > div > app-budget-reports-grid > div > div > h5');
  await expect(title1).toBeVisible();
  await expect(title1).toHaveScreenshot('02-title-reports-visible.png');

  // Step 3: Validate subtitle
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const subtitle = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li');
  await expect(subtitle).toBeVisible();
  await expect(subtitle).toHaveScreenshot('03-subtitle-sources-and-uses.png');

  // Step 4: Validate report/table icon
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');


  // Step 5: Search option
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const searchBox = page.locator('#filter-text-box');
  await expect(searchBox).toBeVisible();
  await expect(searchBox).toHaveScreenshot('05-search-box-visible.png');

  // Step 6: Export Excel
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const exportExcel = page.locator('body > app-root ... li:nth-child(2)');
  await expect(exportExcel).toBeVisible();
  await expect(exportExcel).toHaveScreenshot('06-export-excel-visible.png');

  // Step 7: Fullscreen icon
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const fullscreen = page.locator('body > app-root ... li:nth-child(1) > img');
  await expect(fullscreen).toBeVisible();
  await expect(fullscreen).toHaveScreenshot('07-fullscreen-icon-visible.png');

  // Step 8: Columns tab
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const columnsTab = page.locator('body > app-root ... div:nth-child(1) > button');
  await expect(columnsTab).toBeVisible();
  await expect(columnsTab).toHaveScreenshot('08-columns-tab-visible.png');

  // Step 9: Filters tab
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const filtersTab = page.locator('body > app-root ... div:nth-child(2) > button');
  await expect(filtersTab).toBeVisible();
  await expect(filtersTab).toHaveScreenshot('09-filters-tab-visible.png');

  // Step 10: Drag row group bar
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const dragRowBar = page.locator('body > app-root ... ag-column-drop-wrapper > div:nth-child(1)');
  await expect(dragRowBar).toBeVisible();
  await expect(dragRowBar).toHaveScreenshot('10-drag-row-group-bar-visible.png');

  // Step 11: Table itself
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const table = page.locator('body > app-root ... app-budget-ag-report > div');
  await expect(table).toBeVisible();
  await expect(table).toHaveScreenshot('11-table-visible.png');

  // Step 12: Dropdown interaction
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const dropdown = page.locator('body > app-root ... ag-group-contracted > span');
  await dropdown.click();
  await page.waitForTimeout(1000);
  await expect(dropdown).toHaveScreenshot('12-dropdown-clicked.png');

  // Step 13: Next button
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();
  await expect(tableIcon).toHaveScreenshot('04-report-icon-visible.png');
  const nextBtn = page.locator('#ag-3833 > span.ag-paging-page-summary-panel > div:nth-child(4) > span');
  await expect(nextBtn).toBeVisible();
  await expect(nextBtn).toHaveScreenshot('13-next-button-visible.png');
});
