test('Verify Fund Center Dropdown Selection Works', async ({ page }) => {
  await page.waitForTimeout(5000);

  // Locate and click Fund Center dropdown
  const fundCenterDropdown = page.locator('div.ng-select-container');
  await fundCenterDropdown.waitFor({ state: 'visible', timeout: 15000 });
  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-dropdown-visible.png');

  await fundCenterDropdown.click();
  await page.waitForTimeout(2000);

  // Ensure dropdown panel is present
  const dropdownPanel = page.locator('div.ng-dropdown-panel');
  await dropdownPanel.waitFor({ state: 'visible', timeout: 10000 });

  // Select the "ITSDG (81737) Dept Grouping" option
  const newOption = dropdownPanel.locator('div.ng-option:has-text("ITSDG (81737)")');
  await newOption.waitFor({ state: 'visible', timeout: 10000 });
  await newOption.click();
  await page.waitForTimeout(2000);

  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-option-selected.png');

  // Reopen dropdown to revert
  await fundCenterDropdown.click();
  await page.waitForTimeout(2000);

  const originalOption = dropdownPanel.locator('div.ng-option:has-text("ITSDA (9176)")');
  await originalOption.waitFor({ state: 'visible', timeout: 10000 });
  await originalOption.click();
  await page.waitForTimeout(2000);

  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-option-reverted.png');
});
