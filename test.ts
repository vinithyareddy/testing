test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  test.setTimeout(60000); // Allow up to 60s for slow load

  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Wait until data rows are loaded (indicates data is ready)
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 20000 });

  // Recreate locator AFTER data appears — avoids stale reference
  const viewMore = page.getByRole('button', { name: 'View More' });

  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.click();

  await page.waitForTimeout(500); // Optional: wait for expansion animation
});
