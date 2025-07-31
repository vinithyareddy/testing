test('Verify Fund Center Dropdown Selection Works', async ({ page }) => {
  await page.waitForTimeout(6000);
  const fundCenterDropdown = page.locator('div.ng-select-container'); 
  await fundCenterDropdown.waitFor({ state: 'visible', timeout: 120000 });
  await expect(fundCenterDropdown).toHaveScreenshot('qa-dashboard-fund-center-dropdown.png');
  await fundCenterDropdown.click();
  await page.waitForTimeout(2000);
  const newOption = page.locator('div[role="option"]:has-text("ITSDG (81737) Dept Grouping")');
  await newOption.waitFor({ state: 'visible', timeout: 6000 });
  await newOption.click();
  await page.waitForTimeout(2000);
  await expect(fundCenterDropdown).toHaveScreenshot('qa-dashboard-fund-center-dropdown-option.png');
  await fundCenterDropdown.click();
  await page.waitForTimeout(2000);
  const originalOption = page.locator('div[role="option"]:has-text("ITSDA (9176) Data & Analytical Solutions (Division)")');
  await originalOption.waitFor({ state: 'visible', timeout: 6000 });
  await originalOption.click();
  await page.waitForTimeout(500);
});

test('Verify QA Year Dropdown Selection Works', async ({ page }) => {
  await page.waitForTimeout(6000);
  const qaYearDropdown = page.locator('div.ng-select-container');
  await qaYearDropdown.waitFor({ state: 'visible', timeout: 120000 });
  await expect(qaYearDropdown).toHaveScreenshot('qa-dashboard-qa-year-dropdown.png');
  await qaYearDropdown.click();
  await page.waitForTimeout(2000);
  const newOption = page.locator('div[role="option"]:has-text("FY24")');
  await newOption.waitFor({ state: 'visible', timeout: 6000 });
  await newOption.click();
  await page.waitForTimeout(2000);
  await expect(qaYearDropdown).toHaveScreenshot('qa-dashboard-qa-year-dropdown-option.png');
  await qaYearDropdown.click();
  await page.waitForTimeout(2000);
  const originalOption = page.locator('div[role="option"]:has-text("FY25")');
  await originalOption.waitFor({ state: 'visible', timeout: 6000 });
  await originalOption.click();
  await page.waitForTimeout(500);
});

test('Verify Include Subordinate Units Toggle Works', async ({ page }) => {
  await page.waitForTimeout(6000);
  const toggleSwitch = page.locator('span.toggle-button-switch');
  await toggleSwitch.waitFor({ state: 'visible', timeout: 120000 });
  await expect(toggleSwitch).toHaveScreenshot('qa-dashboard-include-subordinate-toggle.png');
  await toggleSwitch.click();
  await page.waitForTimeout(2000);
  await expect(toggleSwitch).toHaveScreenshot('qa-dashboard-include-subordinate-toggle-off.png');
  await toggleSwitch.click();
  await page.waitForTimeout(500);
});

test('Verify Print Button', async ({ page }) => {
  await page.waitForTimeout(6000);
  const printButton = page.locator('button.printbtn');
  await printButton.waitFor({ state: 'visible', timeout: 120000 });
  await expect(printButton).toHaveScreenshot('qa-dashboard-print-button.png');
});

test('Verify Heading Text', async ({ page }) => {
  await page.waitForTimeout(6000);
  const headingText = page.locator('span.ng-star-inserted:has-text("ITSDA (9176) Data & Analytical Solutions (Division)")');
  await headingText.waitFor({ state: 'visible', timeout: 120000 });
  await expect(headingText).toHaveScreenshot('qa-dashboard-heading-text.png');
});

test('Verify Action Required and Pending Exceptions Links', async ({ page }) => {
  await page.waitForTimeout(6000);
  const actionRequired = page.locator('span.pending-content.tm-tag:has-text("Documents / Clarifications pending: 0")');
  const actionPendingFY25 = page.locator('span.pending-content.tm-tag:has-text("FY25: 0")');
  const actionPendingFY24 = page.locator('span.pending-content.tm-tag:has-text("FY24: 0")');
  await actionRequired.waitFor({ state: 'visible', timeout: 120000 });
  await actionPendingFY25.waitFor({ state: 'visible', timeout: 120000 });
  await expect(actionRequired).toHaveScreenshot('action-required-visible.png');
  await expect(actionPendingFY25).toHaveScreenshot('action-pending-visible.png');
  await actionRequired.click();
  await page.waitForTimeout(6000);
  await expect(page).toHaveScreenshot('qa-dashboard-action-required-by-units-documents-clarifications.png');
  const backtopage = page.locator('');
  await backtopage.click();
  await page.waitForTimeout(3000);
  await actionPendingFY25.click();
  await page.waitForTimeout(6000);
  await expect(page).toHaveScreenshot('qa-dashboard-action-required-by-units-pending-exceptions-page-fy25.png');
  const backtopage = page.locator('');
  await backtopage.click();
  await page.waitForTimeout(3000);
  await actionPendingFY24.click();
  await page.waitForTimeout(6000);
  await expect(page).toHaveScreenshot('qa-dashboard-action-required-by-units-pending-exceptions-page-fy24.png');
  const backtopage = page.locator('');
  await backtopage.click();
  await page.waitForTimeout(500);
});

test('Verify 3 Yr Trend - Count of Exceptions Title', async ({ page }) => {
  await page.waitForTimeout(6000);
  const trendTitle = page.locator('span:has-text("3 Yr Trend - Count of Exceptions")');
  await trendTitle.waitFor({ state: 'visible', timeout: 120000 });
  await expect(trendTitle).toHaveScreenshot('qa-dashboard-3yr-trend-count-of-exceptions-title.png');
});

test('Verify Info Icon and Tooltip for 3 Yr Trend', async ({ page }) => {
  await page.waitForTimeout(6000);
  const infoIcon = page.locator('lift-popover.ng-star-inserted');
  await infoIcon.waitFor({ state: 'visible', timeout: 120000 });
  await expect(infoIcon).toHaveScreenshot('qa-dashboard-info-icon-visible.png');
  await infoIcon.click();
  await page.waitForTimeout(2000);
  const tooltip = page.locator('div.popover-content.popover-body');
  await tooltip.waitFor({ state: 'visible', timeout: 6000 });
  await expect(tooltip).toHaveScreenshot('qa-dashboard-info-tooltip-visible.png');
});

test('Verify Expense Area Filter Dropdown Works', async ({ page }) => {
  await page.waitForTimeout(6000);
  const expenseAreaDropdown = page.locator('mat-select');
  await expenseAreaDropdown.waitFor({ state: 'visible', timeout: 120000 });
  await expect(expenseAreaDropdown).toHaveScreenshot('qa-dashboard-expense-area-dropdown-visible.png');
  await expenseAreaDropdown.click();
  await page.waitForTimeout(2000);
  const travelOption = page.locator('mat-option:has-text("Travel")');
  await travelOption.waitFor({ state: 'visible', timeout: 6000 });
  await travelOption.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('qa-dashboard-expense-area-option-travel.png');
  await expenseAreaDropdown.click();
  await page.waitForTimeout(2000);
  const allOption = page.locator('mat-option:has-text("All")');
  await allOption.waitFor({ state: 'visible', timeout: 6000 });
  await allOption.click();
  await page.waitForTimeout(500);
});

test('Verify QA Review Data Modal Works', async ({ page }) => {
  await page.waitForTimeout(6000);
  const qaReviewDataBtn = page.locator('text="QA Review Data"');
  await qaReviewDataBtn.waitFor({ state: 'visible', timeout: 120000 });
  await expect(qaReviewDataBtn).toHaveScreenshot('qa-dashboard-qa-review-data-visible.png');
  await qaReviewDataBtn.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('qa-dashboard-qa-review-data-modal-open.png');
  const fy24Tab = page.locator('span.mdc-tab__text-label:has-text("FY24")');
  await fy24Tab.waitFor({ state: 'visible', timeout: 6000 });
  await fy24Tab.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('qa-dashboard-qa-review-data-fy24.png');
  const fy23Tab = page.locator('span.mdc-tab__text-label:has-text("FY23")');
  await fy23Tab.waitFor({ state: 'visible', timeout: 6000 });
  await fy23Tab.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('qa-dashboard-qa-review-data-fy23.png');
  const closeBtn = page.locator('i.fa.fa-times.float-right');
  await closeBtn.waitFor({ state: 'visible', timeout: 6000 });
  await closeBtn.click();
  await page.waitForTimeout(500);
});

test('Verify Data Above 3 Yr Trend Chart', async ({ page }) => {
  await page.waitForTimeout(3000);
  const graphDataWidget = page.locator('div.widgetBox');
  await graphDataWidget.waitFor({ state: 'visible', timeout: 120000 });
  await expect(graphDataWidget).toHaveScreenshot('qa-dashboard-3yr-trent-widget-data-data-visible.png');
});

test('Verify 3 Yr Trend Graph', async ({ page }) => {
  await page.waitForTimeout(3000);
  const threeYearTrendGraph = page.locator('div.row >> nth=0'); 
  await threeYearTrendGraph.waitFor({ state: 'visible', timeout: 120000 });
  await expect(threeYearTrendGraph).toHaveScreenshot('qa-dashboard-three-year-trend-graph-visible.png');
});

test('Verify Delay in PO Creation Graph and Title', async ({ page }) => {
  await page.waitForTimeout(3000);
  const delayTitle = page.locator('div.sub-heading.p-l-0.p-r-0:has-text("Delay in PO Creation")');
    await delayTitle.waitFor({ state: 'visible', timeout: 120000 });
  await expect(delayTitle).toHaveScreenshot('qa-dashboard-delay-in-po-title-visible.png');
  const delayGraph = page.locator('highcharts-chart');
    await delayGraph.waitFor({ state: 'visible', timeout: 120000 });
  await expect(delayGraph).toHaveScreenshot('qa-dashboard-delay-in-po-graph-visible.png');
});

test('Verify Incorrect Fiscal Year data and chart', async ({ page }) => {
  await page.waitForTimeout(3000);
  const incorrectFiscalYearTitle = page.locator('div.sub-heading.p-l-0.p-r-0:has-text("Incorrect fiscal year")');
    await incorrectFiscalYearTitle.waitFor({ state: 'visible', timeout: 120000 });
  await expect(incorrectFiscalYearTitle).toHaveScreenshot('qa-dashboard-incorrect-fiscal-year-title-visible.png');
  const incorrectFiscalYearChart = page.locator('div.inner-cart-box.p-2 >> div.highcharts-chart');
  await incorrectFiscalYearChart.waitFor({ state: 'visible', timeout: 120000 });
  await expect(incorrectFiscalYearChart).toHaveScreenshot('qa-dashboard-incorrect-fiscal-year-chart-visible.png');
});
