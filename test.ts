test('Verify WPBPG Fullscreen Icon is Clickable', async ({ page }) => {
  test.setTimeout(180000); // 3 minutes

  // Navigate manually if not routed by default
  await page.goto('https://standardreportsbeta.worldbank.org/budget-glance');

  // Wait for widget itself to exist and be visible
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'attached', timeout: 90000 });
  await expect(widget).toBeVisible({ timeout: 90000 });

  // Wait 2s in case DOM is still hydrating
  await page.waitForTimeout(2000);

  // Find the fullscreen icon inside the widget (use safer generic selector)
  const fullscreenIcon = widget.locator('i[class*="fullscreen"]');

  // Retry visibility check and log fallback if not found
  try {
    await fullscreenIcon.scrollIntoViewIfNeeded();
    await expect(fullscreenIcon).toBeVisible({ timeout: 60000 });

    await fullscreenIcon.click();
    await page.waitForTimeout(1000);

    await expect(fullscreenIcon).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen.png');
  } catch (error) {
    console.error('⚠️ Fullscreen icon not found or page crashed.');
    await page.screenshot({ path: 'wpbpg_fullscreen_error.png', fullPage: true });
    throw error;
  }
});
