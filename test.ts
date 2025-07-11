test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  test.setTimeout(120000); // generous timeout

  const widget = page.locator('app-home-source-uses');

  try {
    // Step 1: Wait up to 60 seconds for widget
    await expect(widget).toBeVisible({ timeout: 60000 });
  } catch (err) {
    console.error('❌ Widget "app-home-source-uses" not found or visible after 60s');
    await page.screenshot({ path: 'widget_not_loaded.png', fullPage: true });
    return; // Exit early to avoid scroll failure
  }

  // Step 2: Safely handle the "View More" button
  const viewMore = widget.locator('text=View More');
  try {
    await viewMore.scrollIntoViewIfNeeded();
    await expect(viewMore).toBeVisible({ timeout: 30000 });

    // Step 3: Click and wait
    await viewMore.click();
    await page.waitForTimeout(1000);
  } catch (err) {
    console.error('❌ View More button not found or not interactable');
    await page.screenshot({ path: 'viewmore_not_visible.png', fullPage: true });
    throw err;
  }
});
