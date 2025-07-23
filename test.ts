test('Close Filter Tab', async ({ page }) => {
  // Wait for page and filter panel to fully render
  await page.waitForTimeout(2000);

  // Use a simplified selector that directly targets the close icon
  const closeIcon = page.locator('button[title="Close"]');

  // Make sure it's visible before clicking
  await expect(closeIcon).toBeVisible({ timeout: 10000 });

  // Click the close icon
  await closeIcon.click();

  // Optional: validate panel is gone or wait briefly
  await page.waitForTimeout(2000);
});
