test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  const widget = page.locator('app-source-users .card');
  await expect(widget).toBeVisible({ timeout: 10000 });

  const fullscreenIcon = page.locator('app-source-users span.view').first();
  await expect(fullscreenIcon).toBeVisible();
  await fullscreenIcon.click();

  await page.waitForTimeout(2000);

  // Capture only the top widget (not the full screen)
  await widget.screenshot({ path: 'sr-sources-uses-widget-fullscreen.png' });
});
