test('verify view more - full screen option', async ({ page }) => {
  const widget = page.locator('app-wpa-allocations');
  await expect(widget).toBeVisible({ timeout: 10000 });

  const viewMore = page.locator('div.viewmore.pointer');

  await viewMore.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Let layout stabilize
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.click();
  await page.waitForTimeout(1000);

  const fullscreen = page.locator('li:nth-child(1) img'); // Simpler selector
  await expect(fullscreen).toBeVisible();
  await expect(fullscreen).toHaveScreenshot('sr-fp-vs-actual-wpa-allocations-view-more-fullscreen-option.png');
});
