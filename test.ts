test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  // Wait for the Sources and Uses widget
  await page.waitForSelector('app-home-source-uses', { timeout: 10000 });

  // Try locating the fullscreen icon using its aria-label or title, fallback to SVG or image role if needed
  const fullscreenIcon = page.locator('app-home-source-uses button[title*="Full screen"], app-home-source-uses .view_more');

  await expect(fullscreenIcon).toBeVisible({ timeout: 5000 });

  await fullscreenIcon.click();
  await page.waitForTimeout(500);

  await expect(fullscreenIcon).toHaveScreenshot('sr-budget-glance-sources-fullscreen-icon.png');
});
