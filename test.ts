test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Wait until at least one row is rendered before finding the button
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 10000 });

  const viewMore = page.locator('button:has-text("View More")');
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.click();
  await page.waitForTimeout(1000);

  // Optional validation
  await expect(page.locator('.view-more')).toBeVisible();
});
