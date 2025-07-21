test('report row dropdown in table', async ({ page }) => {
  // Step 1: Go to Reports tab
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();

  // Step 2: Click the table icon
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();

  // Step 3: Wait for table group row dropdown icon to appear
  const dropdownIcon = page.locator('.ag-row-group .ag-group-contracted'); // more robust

  await dropdownIcon.first().waitFor({ state: 'visible', timeout: 10000 }); // wait for dropdown to appear
  await dropdownIcon.first().scrollIntoViewIfNeeded();
  await dropdownIcon.first().click();

  // Step 4: Wait for expanded row to appear (indicates click worked)
  await page.waitForSelector('.ag-group-expanded', { timeout: 5000 });

  // Step 5: Screenshot the clicked dropdown
  await expect(dropdownIcon.first()).toHaveScreenshot('sr-sources-uses-reports-dropdown-clicked.png');
});
