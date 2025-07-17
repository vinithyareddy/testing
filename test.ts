test('Verify Sources and Uses Widget in $M and $K modes', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22,%22bg1%252~ITSVP%22%5D');

  // Wait for the main Sources and Uses widget to load
  const sourcesWidget = page.locator('app-home-source-uses .TableView');
  await expect(sourcesWidget).toBeVisible({ timeout: 30000 });

  // Click $K toggle (assuming the rightmost is $K)
  const currencyToggleK = page.locator('text=$K');
  await currencyToggleK.click();
  await page.waitForTimeout(1000); // allow time for widget update
  await sourcesWidget.scrollIntoViewIfNeeded();
  await expect(sourcesWidget).toHaveScreenshot('sr-sources-uses-K-mode.png', { timeout: 10000 });

  // Click $M toggle
  const currencyToggleM = page.locator('text=$M');
  await currencyToggleM.click();
  await page.waitForTimeout(1000); // allow time for widget update
  await sourcesWidget.scrollIntoViewIfNeeded();
  await expect(sourcesWidget).toHaveScreenshot('sr-sources-uses-M-mode.png', { timeout: 10000 });
});
