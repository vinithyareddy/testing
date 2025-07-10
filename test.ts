test('Verify Dropdown Icon beside Fullscreen in Sources Widget', async ({ page }) => {
  // Wait for widget wrapper to load first
  await page.waitForSelector('app-home-source-uses', { timeout: 10000 });

  // Locate the dropdown icon near fullscreen using role or class
  const dropdownIcon = page.locator('app-home-source-uses .dropdown-toggle, app-home-source-uses i.fa-ellipsis-v');

  await expect(dropdownIcon).toBeVisible({ timeout: 5000 });
  await dropdownIcon.click();

  await page.waitForTimeout(500);

  await expect(dropdownIcon).toHaveScreenshot('sr-budget-glance-sources-dropdown-clicked.png');
});
