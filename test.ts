test('Verify Commitments Widget Title Tooltip', async ({ page }) => {
  // Navigate first (if needed)
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd');

  // Check if redirected to login
  if (page.url().includes('login.microsoftonline.com')) {
    throw new Error('Not authenticated — redirected to login page.');
  }

  // Wait for the widget to be present and visible
  const tooltipIcon = page.locator('app-commitments').getByRole('link');

  await expect(tooltipIcon).toBeVisible({ timeout: 10000 }); // wait max 10s

  // Click the tooltip icon
  await tooltipIcon.click();

  // Assert the tooltip is shown with correct title
  await expect(page.locator('h3.popover-title')).toHaveText(/Commitments/i, {
    timeout: 5000,
  });

  // Optionally: close it if needed (e.g., click the "Close" button)
  await page.locator('button:has-text("Close")').click();
});
