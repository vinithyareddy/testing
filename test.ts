test('Verify Sources Breakdown Widget in $M and $K modes', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  // Widget container — simpler and more stable
  const sourcesWidget = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div');
  await expect(sourcesWidget).toBeVisible({ timeout: 30000 });

  await sourcesWidget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Click to switch to $K mode
  const currencyToggleK = page.locator(
    'lift-toggle label span'
  );
  await expect(currencyToggleK).toBeVisible({ timeout: 5000 });
  await currencyToggleK.click();
  await page.waitForTimeout(1500);

  // Take screenshot in $K mode
  await expect(sourcesWidget).toHaveScreenshot('sr-sources-breakdown-K-mode.png', { timeout: 10000 });

  // Click again to switch to $M mode
  await currencyToggleK.click();
  await page.waitForTimeout(1500);

  // Take screenshot in $M mode
  await expect(sourcesWidget).toHaveScreenshot('sr-sources-breakdown-M-mode.png', { timeout: 10000 });
});
