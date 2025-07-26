test('Verify Expand Icon Click', async ({ page }) => {
  await page.waitForTimeout(8000); // Wait for widget to load

  const widget = page.locator('app-burnrate'); // Confirm this loads the whole widget
  await expect(widget).toBeVisible({ timeout: 10000 });

  const expandIcon = page.locator('img[src*="collapse-expand"]');
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  await expandIcon.click();
  await expect(expandIcon).toHaveScreenshot('sr-fp-vs-actual-responsible-expand-icon.png');
});
