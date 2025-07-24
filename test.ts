test('Verify report row dropdown in table', async ({ page }) => {
  // Step 1: Click Reports tab
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.waitFor({ state: 'visible', timeout: 10000 });
  await reportsTab.click();

  // Step 2: Click Report Icon
  const tableIcon = page.locator('img.img-report-icon.p-3.ng-star-inserted');
  await tableIcon.first().waitFor({ state: 'visible', timeout: 10000 });
  await tableIcon.first().click();

  // Step 3: Wait for AG Grid table to render fully
  const firstRowDropdownIcon = page.locator('span.ag-icon.ag-icon-tree-closed');
  await firstRowDropdownIcon.first().waitFor({ state: 'visible', timeout: 15000 });

  // Step 4: Click dropdown icon in first row
  await firstRowDropdownIcon.first().scrollIntoViewIfNeeded();
  await firstRowDropdownIcon.first().click();

  // Step 5: Capture screenshot
  await expect(page).toHaveScreenshot('sr-trs-reports-dropdown-clicked.png');
});
