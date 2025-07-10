test('Verify Dropdown Icon beside Fullscreen in Sources Widget', async ({ page }) => {
  // Wait for the entire widget to be visible first
  await page.waitForSelector('app-home-source-uses', { timeout: 10000 });

  // Look for any element near fullscreen using known text, tooltips, or tag names
  const dropdownIcon = page.locator('app-home-source-uses span[class*=collapse-state]');

  await expect(dropdownIcon).toBeVisible({ timeout: 5000 });
  await dropdownIcon.click();

  await page.waitForTimeout(500);

  await expect(dropdownIcon).toHaveScreenshot('sr-budget-glance-sources-dropdown-clicked.png');
});
