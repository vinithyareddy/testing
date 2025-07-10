test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  // Wait for main widget
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Locate the button inside it — with a flexible selector
  const viewMore = widget.locator('text=View More');

  // Optionally scroll into view in case it's hidden offscreen
  await viewMore.scrollIntoViewIfNeeded();

  // Wait for visibility
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  // Click
  await viewMore.click();

  // Wait for animation or result
  await page.waitForTimeout(1000);

  // Optional screenshot or verification
  await expect(page.locator('.view-more')).toBeVisible();
});
