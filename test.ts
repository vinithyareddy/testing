test('report row dropdown in table', async ({ page }) => {
  // Step 1: Go to Reports tab
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();

  // Step 2: Open table icon
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();

  // Step 3: Wait for table data to load
  await page.waitForSelector('.ag-center-cols-clipper .ag-row-group'); // safer selector
  await page.waitForTimeout(1500); // give extra buffer just in case

  // Step 4: Click dropdown icon in first group row
  const dropdownIcon = page.locator('.ag-row-group .ag-group-contracted'); // more stable

  await expect(dropdownIcon.first()).toBeVisible({ timeout: 5000 });
  await dropdownIcon.first().scrollIntoViewIfNeeded();
  await dropdownIcon.first().click();

  // Step 5: Screenshot
  await expect(dropdownIcon.first()).toHaveScreenshot('sr-sources-uses-reports-dropdown-clicked.png');
});
