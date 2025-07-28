test('Verify Fullscreen Icon Clickable', async ({ page }) => {
  // Navigate safely
  await page.goto('https://standardreportsbetaqa.worldbank.org/work-program', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait for the widget to appear in DOM
  const widget = page.locator('app-wpa-allocations');
  await expect(widget).toBeVisible({ timeout: 15000 });

  // Wait for fullscreen icon to appear and be interactable
  const fullscreenIcon = widget.locator('span.view i.fa-expand');
  await expect(fullscreenIcon).toBeVisible({ timeout: 15000 });

  // Scroll into view before interaction
  await fullscreenIcon.scrollIntoViewIfNeeded();

  // Click to expand
  await fullscreenIcon.click();

  // Confirm icon or widget expanded (optional: check class/state change)
  await page.waitForTimeout(1000); // short delay for animation

  // Screenshot after fullscreen is triggered
  await expect(fullscreenIcon).toHaveScreenshot('sr-wpa-allocations-fullscreen.png');

  // Click again to minimize
  await fullscreenIcon.click();

  // Optional: wait for collapse animation or state
  await page.waitForTimeout(500);
});
