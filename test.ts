test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Confirm that data is rendered
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 10000 });

  const viewMore = page.getByRole('button', { name: 'View More' });
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.click();
  await page.waitForTimeout(500); // Optional: expansion effect
});
