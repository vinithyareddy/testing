test('Verify Sources and Uses Title is Visible', async ({ page }) => {
  // Wait for the main widget to appear
  await page.waitForSelector('app-home-source-uses', { timeout: 10000 });

  // Target the actual title using visible text
  const title = page.locator('app-home-source-uses h5, app-home-source-uses span', { hasText: 'Sources and Uses' });

  await expect(title).toBeVisible({ timeout: 10000 });
  await expect(title).toHaveScreenshot('sr-budget-glance-sources-title-visible.png');
});
