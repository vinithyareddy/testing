test('Verify Expense Area Filter Dropdown Works', async ({ page }) => {
  await page.waitForTimeout(6000);

  const expenseAreaDropdown = page.locator('mat-select');
  await expenseAreaDropdown.waitFor({ state: 'visible', timeout: 120000 });
  await expect(expenseAreaDropdown).toHaveScreenshot('expense-area-dropdown-visible.png');

  // Click dropdown to show options
  await expenseAreaDropdown.click();
  await page.waitForTimeout(2000);

  // Use overlay container for mat-option
  const travelOption = page.locator('div[role="listbox"] mat-option >> text=Travel');
  await travelOption.waitFor({ state: 'visible', timeout: 8000 });
  await travelOption.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('expense-area-selected-travel.png');

  // Open dropdown again to revert back
  await expenseAreaDropdown.click();
  await page.waitForTimeout(2000);

  const allOption = page.locator('div[role="listbox"] mat-option >> text=All');
  await allOption.waitFor({ state: 'visible', timeout: 8000 });
  await allOption.click();
  await page.waitForTimeout(2000);
  await expect(expenseAreaDropdown).toHaveScreenshot('expense-area-reverted-all.png');
});
