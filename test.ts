test('Verify WPBPG Fullscreen Icon is Clickable', async ({ page }) => {
  test.setTimeout(180000); // Extend test timeout to 3 minutes

  // Navigate to the Budget-at-a-Glance page with filters
  await page.goto(
    'https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22%5D'
  );

  // Locate WPBPG widget container
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 90000 });

  // Wait for DOM hydration
  await page.waitForTimeout(2000);

  // Locate fullscreen icon inside the widget — use class selector for safety
  const fullscreenIcon = widget.locator('i[class*="fullscreen"]');

  try {
    await fullscreenIcon.scrollIntoViewIfNeeded();
    await expect(fullscreenIcon).toBeVisible({ timeout: 60000 });

    await fullscreenIcon.click();
    await page.waitForTimeout(1000);

    await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen.png');
  } catch (error) {
    console.error('⚠️ Fullscreen icon not found or interaction failed.');
    await page.screenshot({ path: 'wpbpg_fullscreen_error.png', fullPage: true });
    throw error;
  }
});
