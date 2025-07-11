test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  test.setTimeout(90000); // generous timeout for full dashboard

  // Step 1: Wait for the widget (Sources and Uses) to appear
  const widget = page.locator('app-home-source-uses');
  await expect(widget).toBeVisible({ timeout: 30000 });

  // Step 2: Find and verify the "View More" button inside the widget
  const viewMore = widget.getByRole('button', { name: 'View More' }); // Preferred if button role exists
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  // Step 3: Click the button
  await viewMore.click();

  // Optional: Wait for animation or expanded content
  await page.waitForTimeout(1000);
});
