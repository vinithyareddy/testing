test('Verify Projected BB Outcome Title is Visible', async ({ page }) => {
  test.setTimeout(60000); // extend total test timeout for slow pages

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded'); // wait for initial load
  await page.waitForTimeout(3000); // buffer for async UI

  const title = page.locator('div.budget-box-h1'); // use shorter selector if unique

  await title.waitFor({ state: 'visible', timeout: 15000 });

  await expect(title).toBeVisible();
  await expect(title).toHaveScreenshot('sr-sources-uses-projected-bb-outcome-title.png');
});
