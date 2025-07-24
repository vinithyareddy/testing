test('verify view more - full screen option', async ({ page }) => {
  test.setTimeout(120000);

  // Target outer widget area using more reliable locator
  const widget = page.locator('app-temp-code >> div >> div >> div');

  // Safer and flexible view more locator (can also try: hasText('View More'))
  const viewMore = page.locator('text=View More');

  // Wait for widget and view more to show up
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 15000 });

  await expect(viewMore).toBeVisible({ timeout: 15000 });

  await viewMore.scrollIntoViewIfNeeded();
  await viewMore.click();

  // Wait after navigation to full screen page
  await page.waitForTimeout(5000);

  const fullScreenIcon = page.locator('app-rm-ag-report ul > li:nth-child(1) > img');

  await expect(fullScreenIcon).toBeVisible({ timeout: 15000 });
  await expect(fullScreenIcon).toHaveScreenshot('sr-wpa-temp-code-view-more-fullscreen-option.png');
});
