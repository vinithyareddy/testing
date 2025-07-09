test('Verify Commitments Widget Title Tooltip', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd');

  // Ensure authenticated
  if (page.url().includes('login.microsoftonline.com')) {
    throw new Error('❌ Not authenticated — redirected to login page.');
  }

  const tooltipTrigger = page.locator('app-commitments').getByRole('link');

  // Check the tooltip trigger is visible
  await expect(tooltipTrigger).toBeVisible({ timeout: 10000 });

  // Click the ⓘ tooltip icon (wait for stability)
  await tooltipTrigger.click();

  const tooltipHeading = page.locator('h3.popover-title');

  // Confirm tooltip appeared
  await expect(tooltipHeading).toHaveText(/Commitments/i, { timeout: 5000 });

  // Close button (optional — only if visible)
  const closeButton = page.locator('button:has-text("Close")');
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
});
