test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  // Wait for the widget to appear
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Wait for "View More" button without depending on table row
  const viewMore = page.getByRole('button', { name: 'View More' }); // Better than .locator('button:has-text("View More")')

  // Optionally scroll if off-screen
  await viewMore.scrollIntoViewIfNeeded();

  // Wait and click
  await expect(viewMore).toBeVisible({ timeout: 10000 });
  await viewMore.click();

  // Optional: verify something happened (expansion, new rows, etc.)
  await page.waitForTimeout(1000);
});
