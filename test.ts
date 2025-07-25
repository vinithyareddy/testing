test('Verify Money Bag Icon is Visible', async ({ page }) => {
  await page.waitForTimeout(3000);

  const burnRateWidget = page.locator('div.budget-box-h1').first();
  const icon = burnRateWidget.locator('img[src*="icon.svg"]');

  await expect(icon).toBeVisible({ timeout: 10000 });
  await expect(icon).toHaveScreenshot('sr-wpa-burn-rate-moneybag-icon.png');
});
