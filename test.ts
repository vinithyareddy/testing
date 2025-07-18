test('Verify Forecast Sources and Uses Values Are Visible', async ({ page }) => {
  await page.goto('https://standardreportsbetaqa.worldbank.org/source-uses?...'); // your URL here

  // Wait for page to finish rendering
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Use more generic selectors — anchor on known text content or role if possible
  const sourcesValue = page.locator('text=Forecast Sources'); // Finds card with 'Forecast Sources'
  const usesValue = page.locator('text=Forecast Uses');       // Finds card with 'Forecast Uses'

  await sourcesValue.scrollIntoViewIfNeeded();
  await expect(sourcesValue).toBeVisible({ timeout: 10000 });

  await usesValue.scrollIntoViewIfNeeded();
  await expect(usesValue).toBeVisible({ timeout: 10000 });

  await expect(sourcesValue).toHaveScreenshot('sr-sources-forecast-value.png', {
    animations: 'disabled',
  });
  await expect(usesValue).toHaveScreenshot('sr-sources-uses-value.png', {
    animations: 'disabled',
  });
});
