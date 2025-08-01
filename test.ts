test('Verify QA Year Dropdown Selection Works', async ({ page }) => {
  await page.waitForTimeout(6000);

  const qaYearDropdown = page.locator('div.ng-select-container');
  await qaYearDropdown.waitFor({ state: 'visible', timeout: 120000 });
  await expect(qaYearDropdown).toHaveScreenshot('qa-year-dropdown-visible.png');

  // Step 1: Open dropdown
  await qaYearDropdown.click();
  await page.waitForTimeout(1000);

  // Step 2: Select "FY24"
  const dropdownPanel = page.locator('div.ng-dropdown-panel');
  await dropdownPanel.waitFor({ state: 'visible', timeout: 10000 });

  const fy24Option = dropdownPanel.locator('div.ng-option:has-text("FY24")');
  await fy24Option.waitFor({ state: 'visible', timeout: 6000 });
  await fy24Option.click();
  await page.waitForTimeout(2000);

  await expect(qaYearDropdown).toHaveScreenshot('qa-year-option-selected.png');

  // Step 3: Reopen dropdown to revert to "FY25"
  await qaYearDropdown.click();
  await page.waitForTimeout(1000);
  await dropdownPanel.waitFor({ state: 'visible', timeout: 10000 });

  const fy25Option = dropdownPanel.locator('div.ng-option:has-text("FY25")');
  await fy25Option.waitFor({ state: 'visible', timeout: 6000 });
  await fy25Option.click();
  await page.waitForTimeout(2000);

  await expect(qaYearDropdown).toHaveScreenshot('qa-year-option-reverted.png');
});
