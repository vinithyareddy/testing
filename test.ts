test('Verify Dropdown Icon beside Fullscreen in Sources Widget', async ({ page }) => {
  await page.waitForSelector('app-home-source-uses', { timeout: 10000 });

  const dropdownIcon = page.locator('app-home-source-uses i[class*=ellipsis]');

  await expect(dropdownIcon).toBeVisible({ timeout: 5000 });
  await dropdownIcon.click();

  await page.waitForTimeout(500);

  await expect(dropdownIcon).toHaveScreenshot('sr-budget-glance-sources-dropdown-clicked.png');
});
