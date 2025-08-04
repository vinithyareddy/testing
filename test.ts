test('verify - Apply Fund Center Filter', async ({ page }) => {
    await page.waitForTimeout(1000);
  
    // Click filter tab
    const filterTab = page.locator('body >> app-root >> internal-framework-root >> div.content-wrapper >> app-reports >> div.container-fluid.header-wrapper');
    await filterTab.click();
  
    await page.waitForTimeout(1000);
  
    // Open region dropdown
    const regionsCountriesDropdown = page.locator('body >> app-root >> internal-framework-root >> div.content-wrapper >> app-reports >> div.right-tray');
    await regionsCountriesDropdown.locator('text=Region').click();
  
    await page.waitForTimeout(1500);
  
    // Select checkbox by its label and find the associated input
    const regionCheckboxLabel = page.locator('label:has-text("Eastern and Southern Africa")');
    await regionCheckboxLabel.waitFor({ state: 'visible', timeout: 10000 });
  
    // Move to the input checkbox using DOM traversal
    const regionCheckboxInput = regionCheckboxLabel.locator('xpath=preceding-sibling::input');
    await regionCheckboxInput.check(); // ✅ use .check() to handle hidden checkboxes
  
    await page.waitForTimeout(1000);
  
    // Screenshot
    await expect(page.locator('text=Apply')).toHaveScreenshot('sr-operation-report-table-filter-panel-fund-center-option-check.png');
  
    // Click Apply
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
  });
  