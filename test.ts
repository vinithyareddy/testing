test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  test.setTimeout(90000); // Allow full widget load

  // Step 1: Wait for the Sources and Uses widget to be visible
  const widget = page.locator('app-home-source-uses');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 30000 });

  // Step 2: Wait for the 'View More' button to appear inside the widget
  const viewMore = widget.locator('text=View More'); // safer than nth-child or div hierarchy
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  // Step 3: Click the button
  await viewMore.click();

  // Step 4: Wait for any resulting UI change (optional)
  await page.waitForTimeout(1000); // optional animation buffer
});
