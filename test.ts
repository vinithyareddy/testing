test('verify View More - Full Screen option from WPA Allocations Outside VPU', async ({ page }) => {
  // Wait for the correct widget container (4th widget as per your DOM)
  const widget = page.locator('#Dashboard > div > div > div:nth-child(4) > div');

  await expect(widget).toBeVisible({ timeout: 10000 });

  // Grab the correct View More button — specifically the one inside this widget
  const viewMore = widget.getByRole('button', { name: 'View More' }).first();

  await expect(viewMore).toBeVisible({ timeout: 10000 });

  // Scroll and click View More
  await viewMore.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await viewMore.click();

  // Wait for navigation to the next page
  await page.waitForLoadState('networkidle');

  // Ensure Full Screen button appears — use partial match on class if needed
  const fullscreen = page.locator('li:nth-child(1) >> img[title="Zoom"]');

  await expect(fullscreen).toBeVisible({ timeout: 10000 });

  // Screenshot of the full-screen icon option
  await expect(fullscreen).toHaveScreenshot('sr-wpa-viewmore-fullscreen-option.png');
});
