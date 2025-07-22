test('Verify Page content coming soon', async ({ page }) => {
  // Use a more reliable selector from your screenshot
  const content = page.locator('div.widget-heading-p1-p2', { hasText: 'Coming Soon' });

  // Wait for it to be visible with timeout
  await expect(content).toBeVisible({ timeout: 10000 });

  // Screenshot validation
  await expect(content).toHaveScreenshot('sr-budget-expenses-content.png');
});
