test('Verify WPBPG Fullscreen Icon is Clickable', async ({ page }) => {
  // Increase entire test timeout to 3 minutes
  test.setTimeout(180000);

  // 1. Navigate to the page (if needed)
  await page.goto('https://standardreportsbeta.worldbank.org/budget-glance');

  // 2. Wait for the main widget container to be attached
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'attached', timeout: 90000 });
  await expect(widget).toBeVisible({ timeout: 90000 });

  // 3. Wait for the fullscreen icon specifically
  const fullscreenIcon = widget.locator('i.bx-fullscreen');

  // Debug tip: force scroll in case it’s offscreen
  await fullscreenIcon.scrollIntoViewIfNeeded();

  await expect(fullscreenIcon).toBeVisible({ timeout: 60000 });

  // 4. Click and wait
  await fullscreenIcon.click();
  await page.waitForTimeout(1000);

  // 5. Take screenshot to validate result
  await expect(fullscreenIcon).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen.png');
});
