test('Verify Indicator Approval Status is 0 and 36', async ({ page }) => {
  // Wait for relevant text
  const zero = page.locator('text=0');
  const thirtySix = page.locator('text=36');

  await expect(zero).toBeVisible({ timeout: 10000 });
  await expect(thirtySix).toBeVisible({ timeout: 10000 });

  await expect(zero).toHaveScreenshot('oh-ibrd-ida-indicator-0.png');
  await expect(thirtySix).toHaveScreenshot('oh-ibrd-ida-indicator-36.png');
});
