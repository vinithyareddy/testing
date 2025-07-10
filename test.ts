test('Verify Sources Table Content for Known Department', async ({ page }) => {
  // Wait for the widget itself
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Find row containing a known department name — e.g., 'ITSDG' or 'ITSVD'
  const row = widget.locator('tr', { hasText: 'ITSDG' }); // Update text as per actual

  // Wait for that row to be visible
  await expect(row).toBeVisible({ timeout: 5000 });

  // Check for a known value — use regex if dynamic
  const forecastValue = row.locator('td', { hasText: /^394\.8M$/ }); // or just '394.8'

  await expect(forecastValue).toBeVisible();
});
