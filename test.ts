// Click to open dropdown
await qaYearDropdown.click();
await page.waitForTimeout(1000);

// Select FY24 from global page locator (not from dropdownPanel)
const fy24Option = page.locator('div[role="option"]:has-text("FY24")');
await fy24Option.waitFor({ state: 'visible', timeout: 6000 });
await fy24Option.click();
await page.waitForTimeout(1000);

// Screenshot after selecting FY24
await expect(qaYearDropdown).toHaveScreenshot('qa-year-option-selected.png');

// Reopen and revert
await qaYearDropdown.click();
await page.waitForTimeout(1000);

const fy25Option = page.locator('div[role="option"]:has-text("FY25")');
await fy25Option.waitFor({ state: 'visible', timeout: 6000 });
await fy25Option.click();
await page.waitForTimeout(1000);

// Final screenshot
await expect(qaYearDropdown).toHaveScreenshot('qa-year-option-reverted.png');
