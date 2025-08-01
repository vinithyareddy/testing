test('Verify Fund Center Dropdown Selection Works', async ({ page }) => {
  await page.waitForTimeout(6000);

  // Locate the fund center dropdown
  const fundCenterDropdown = page.locator('div.ng-select-container');

  // Ensure dropdown is visible and take screenshot
  await fundCenterDropdown.waitFor({ state: 'visible', timeout: 120000 });
  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-dropdown-visible.png');

  // Click the dropdown to open it
  await fundCenterDropdown.click();
  await page.waitForTimeout(1000); // allow dropdown to render

  // Select ITSDG (81737) Dept Grouping
  const newOption = page.locator('div[role="option"]:has-text("ITSDG (81737) Dept Grouping")');
  await newOption.waitFor({ state: 'visible', timeout: 6000 });
  await newOption.click();
  await page.waitForTimeout(1000);

  // Take screenshot after selection
  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-option-selected.png');

  // Reopen dropdown to revert
  await fundCenterDropdown.click();
  await page.waitForTimeout(1000);

  // Select original option: ITSDA (9176)...
  const originalOption = page.locator('div[role="option"]:has-text("ITSDA (9176) Data & Analytical Solutions (Division)")');
  await originalOption.waitFor({ state: 'visible', timeout: 6000 });
  await originalOption.click();
  await page.waitForTimeout(1000);

  // Final screenshot
  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-option-reverted.png');
});
