test('Verify Fullscreen Button in Uses Breakdown Widget', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');

  // Ensure widget is in view
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Scoped fullscreen icon inside that widget only
  const fullscreenIcon = widget.locator('span.view > i');

  // Scroll to the fullscreen icon to bring it into view
  await fullscreenIcon.scrollIntoViewIfNeeded();

  // Validate and screenshot
  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });
  await expect(fullscreenIcon).toHaveScreenshot('sr-uses-breakdown-fullscreen-button.png');
});
