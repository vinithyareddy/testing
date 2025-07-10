test('Verify Sources Table Content for Known Department', async ({ page }) => {
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Locate any row with 'ITSDG' text inside the widget, deeper search
  const row = widget.locator(':scope >> text=ITSDG'); // searches deeper inside DOM

  await expect(row).toBeVisible({ timeout: 5000 });

  // Find a matching value in the same widget (e.g. 394.8 or similar)
  const forecastValue = widget.locator('text=/394\.8M?/'); // Adjust pattern if needed

  await expect(forecastValue).toBeVisible();
});
