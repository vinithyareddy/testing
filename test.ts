test('Verify EF Widget in $M and $K modes', async ({ page }) => {
  test.setTimeout(180000);

  const currencyToggle = page.locator('text=$K'); // First click to $K
  await expect(currencyToggle).toBeVisible({ timeout: 10000 });
  await currencyToggle.click();

  await page.waitForTimeout(1000);

  const efwidgetM = page.locator('app-home-top-header-widgets > div > div:nth-child(3) > div');
  await expect(efwidgetM).toBeVisible({ timeout: 10000 });
  await efwidgetM.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await expect(efwidgetM).toHaveScreenshot('sr-budget-glance-ef-widget-M-mode.png', {
    timeout: 10000,
    animations: 'disabled',
  });

  // Re-toggle to $M
  const currencyToggleBack = page.locator('text=$M');
  await currencyToggleBack.click();
  await page.waitForTimeout(2000);

  const efwidgetK = page.locator('app-home-top-header-widgets > div > div:nth-child(3) > div');
  await expect(efwidgetK).toBeVisible({ timeout: 10000 });
  await efwidgetK.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await expect(efwidgetK).toHaveScreenshot('sr-budget-glance-ef-widget-K-mode.png', {
    timeout: 10000,
    animations: 'disabled',
  });
});
