test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('networkidle');

  // Wait for the widget title (a reliable visual cue that widget has loaded)
  const widgetTitle = page.locator('app-source-uses h5'); // Adjust if there's a specific title
  await widgetTitle.waitFor({ state: 'visible', timeout: 15000 });

  // Better selector for the fullscreen icon — use class or aria-label if available
  const fullscreenIcon = page.locator('app-source-uses i.fa-expand'); // replace with actual icon class

  await expect(fullscreenIcon).toBeVisible({ timeout: 15000 });
  await fullscreenIcon.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'screenshots/sr-sources-uses-fullscreen-icon.png', fullPage: false });
});
