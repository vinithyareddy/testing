test('report row dropdown in table', async ({ page }) => {
  // Step 1: Click the Reports tab
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();

  // Wait for report tab content to load fully
  await expect(page.locator('text=Sources and Uses Breakdown Summary Report')).toBeVisible({ timeout: 10000 });

  // Step 2: Click table icon to open the report
  const tableIcon = page.locator('#Reports img'); // Simpler selector
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();

  // Step 3: Wait for ag-grid table and dropdown to appear
  const dropdownIcon = page.locator('.ag-group-contracted'); // Generic selector is safer
  await dropdownIcon.first().waitFor({ state: 'visible', timeout: 10000 });
  await dropdownIcon.first().scrollIntoViewIfNeeded();
  await dropdownIcon.first().click();

  // Step 4: Wait for row to expand
  await page.waitForSelector('.ag-group-expanded', { timeout: 5000 });

  // Step 5: Screenshot the dropdown result
  await expect(page).toHaveScreenshot('sr-sources-uses-reports-dropdown-clicked.png', {
    animations: 'disabled'
  });
});
