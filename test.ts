test('Verify Expand Icon Click', async ({ page }) => {
  await page.waitForTimeout(1000);

  const expandIcon = page.locator(
    'div:has-text("Final Plans vs Actuals by Business Process") >> xpath=following::img[contains(@src, "arrow_down.png")][1]'
  );

  await expect(expandIcon).toBeVisible({ timeout: 10000 });
  await expandIcon.click();
  await page.waitForTimeout(500); // optional wait after click
  await expect(expandIcon).toHaveScreenshot('sr-fp-vs-actual-fundbusinessprocess-expand-icon.png');
});