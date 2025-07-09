test('Verify Undisbursed Balances Widget Tooltip', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('https://mgmtqa.aesetg.worldbank.org/operation_highlight/ibrd', { waitUntil: 'load' });

  // Locate tooltip icon (the small info icon beside "Undisbursed Balances")
  const tooltipIcon = page.locator('app-undisbursed-balance lift-popover i');

  // Scroll and verify it's visible
  await tooltipIcon.scrollIntoViewIfNeeded();
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });

  // Click the tooltip
  await tooltipIcon.click();

  // Verify tooltip content
  await expect(page.locator('h3.popover-title')).toContainText('Undisbursed Balances');

  // Close the tooltip
  await page.getByRole('button', { name: 'Close' }).click();
});
