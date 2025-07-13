test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  // Step 1: Wait up to 90s for the widget container
  await page.waitForSelector('app-outcomebyvpu', { timeout: 90000 });

  // Step 2: Locate fullscreen icon by role or class – use simpler locator (based on icon or alt/title)
  const fullscreenIcon = page.locator('app-outcomebyvpu i[class*="fa-expand"], app-outcomebyvpu i[class*="fullscreen"]');

  // Step 3: Wait for icon to appear
  await expect(fullscreenIcon).toBeVisible({ timeout: 90000 });

  // Step 4: Click the icon
  await fullscreenIcon.click();

  // Step 5: Optional: Wait for fullscreen effect or animation
  await page.waitForTimeout(2000); // adjust if animation is long

  // Step 6: Take screenshot
  await expect(fullscreenIcon).toHaveScreenshot('sr-budget-glance-vpu-fullscreen-icon.png');
});
