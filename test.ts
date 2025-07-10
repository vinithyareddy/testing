test.describe('Projected BB Outcome Widget', () => {

  test('Verify Projected BB Outcome Title is Visible', async ({ page }) => {
    const title = page.locator('text=PROJECTED BB OUTCOME');
    await expect(title).toBeVisible();
    await expect(title).toHaveScreenshot('sr-budget-glance-projected-bb-outcome-title.png');
  });

  test('Verify Money Bag Icon is Visible', async ({ page }) => {
    const icon = page.locator('div.widget-section1 i.bi-currency-dollar'); // Adjust class as per actual DOM
    await expect(icon).toBeVisible();
    await expect(icon).toHaveScreenshot('sr-budget-glance-moneybag-icon.png');
  });

  test('Verify Currency Toggle ($M / $K) is Functional', async ({ page }) => {
    const currencyToggle = page.locator('label.switch-container'); // or find by text $M/$K if toggle has label
    await expect(currencyToggle).toBeVisible();
    await currencyToggle.click(); // toggle to $K
    await page.waitForTimeout(500);
    await expect(currencyToggle).toHaveScreenshot('sr-budget-glance-currency-toggle-k.png');

    await currencyToggle.click(); // toggle back to $M
    await page.waitForTimeout(500);
    await expect(currencyToggle).toHaveScreenshot('sr-budget-glance-currency-toggle-m.png');
  });

  test('Verify Forecast Sources and Uses Values Are Visible', async ({ page }) => {
    const sources = page.locator('text=Forecast Sources');
    const uses = page.locator('text=Forecast Uses');

    await expect(sources).toBeVisible();
    await expect(uses).toBeVisible();

    const sourcesValue = page.locator('div.widget-section1 span:below(:text("Forecast Sources"))');
    const usesValue = page.locator('div.widget-section1 span:below(:text("Forecast Uses"))');

    await expect(sourcesValue).not.toHaveText('');
    await expect(usesValue).not.toHaveText('');

    await expect(sourcesValue).toHaveScreenshot('sr-budget-glance-forecast-sources-value.png');
    await expect(usesValue).toHaveScreenshot('sr-budget-glance-forecast-uses-value.png');
  });

});
