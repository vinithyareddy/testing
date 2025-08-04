test('Verify Category Filter Dropdown Works', async ({ page }) => {
    await page.waitForTimeout(1000);
  
    // 1. Locate the category dropdown by label or class and click it
    const categoryDropdown = page.locator('label:has-text("Category") + div');
    await categoryDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await categoryDropdown.click();
  
    // 2. Wait for dropdown panel to appear
    const dropdownPanel = page.locator('.ng-dropdown-panel');
    await dropdownPanel.waitFor({ state: 'visible', timeout: 8000 });
  
    // 3. Select the 'Portfolio' option by visible text
    const portfolioOption = page.locator('.ng-option', { hasText: 'Portfolio' });
    await portfolioOption.waitFor({ state: 'visible', timeout: 8000 });
    await portfolioOption.click();
  
    // 4. Wait for data to reflect (optional if needed)
    await page.waitForTimeout(2000);
  
    // 5. Take screenshot
    await expect(categoryDropdown).toHaveScreenshot('sr-operations-category-selected-portfolio.png');
  });
  