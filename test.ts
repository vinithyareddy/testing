test('Verify Indicator Approval Status is 0 and 36', async ({ page }) => {
  // Scope to the indicator section to avoid matching unwanted '0' or '36' texts elsewhere
  const section = page.locator('.zapprovalstatus-section');

  const zero = section.locator('text=0').first();         // or use .nth(X) if needed
  const thirtySix = section.locator('text=36').first();   // same here

  // Wait until they are visible
  await expect(zero).toBeVisible({ timeout: 10000 });
  await expect(thirtySix).toBeVisible({ timeout: 10000 });

  // Screenshot validations
  await expect(zero).toHaveScreenshot('oh-ibrd-ida-indicator-0.png');
  await expect(thirtySix).toHaveScreenshot('oh-ibrd-ida-indicator-36.png');
});
