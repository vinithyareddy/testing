test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  // Wait for widget to load
  await page.waitForSelector('app-home-source-uses', { timeout: 10000 });

  // Use more specific class selector for icon
  const fullscreenIcon = page.locator('app-home-source-uses i.fa-expand, app-home-source-uses .view_more');

  // Make sure it's visible and click it
  await expect(fullscreenIcon).toBeVisible({ timeout: 5000 });
  await fullscreenIcon.click();

  // Wait for fullscreen effect or any animation
  await page.waitForTimeout(500);

  // Screenshot for validation
  await expect(fullscreenIcon).toHaveScreenshot('sr-budget-glance-sources-fullscreen-icon.png');
});
