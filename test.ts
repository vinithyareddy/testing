test('Verify Fund Center Dropdown Selection Works', async ({ page }) => {
  await page.waitForTimeout(6000);

  const fundCenterDropdown = page.locator('div.ng-select-container');
  await fundCenterDropdown.waitFor({ state: 'visible', timeout: 120000 });
  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-dropdown-visible.png');

  // Open the dropdown
  await fundCenterDropdown.click();
  await page.waitForTimeout(1000);

  // Wait for the dropdown panel itself
  const dropdownPanel = page.locator('div.ng-dropdown-panel');
  await dropdownPanel.waitFor({ state: 'visible', timeout: 6000 });

  // Select the new option from within the dropdown panel
  const newOption = dropdownPanel.locator('div.ng-option:has-text("ITSDG (81737) Dept Grouping")');
  await newOption.waitFor({ state: 'visible', timeout: 6000 });
  await newOption.click();
  await page.waitForTimeout(1000);

  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-option-selected.png');

  // Reopen dropdown to revert
  await fundCenterDropdown.click();
  await page.waitForTimeout(1000);

  const revertOption = dropdownPanel.locator('div.ng-option:has-text("ITSDA (9176) Data & Analytical Solutions (Division)")');
  await revertOption.waitFor({ state: 'visible', timeout: 6000 });
  await revertOption.click();
  await page.waitForTimeout(1000);

  await expect(fundCenterDropdown).toHaveScreenshot('fund-center-option-reverted.png');
});
