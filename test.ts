test('Verify Undisbursed Balances Widget Tooltip', async ({ page }) => {
  // Step 1: Navigate to the dashboard
  await page.goto('https://mgmtqa.aesetg.worldbank.org/operation_highlight/ibrd', { waitUntil: 'load' });

  // Step 2: Locate the tooltip icon inside the Undisbursed Balances widget
  const tooltipIcon = page.locator('app-undisbursed-balance lift-popover i');

  // Step 3: Scroll into view & ensure visibility
  await tooltipIcon.scrollIntoViewIfNeeded();
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });

  // Step 4: Click the tooltip icon
  await tooltipIcon.click();

  // Step 5: Verify the tooltip title appears correctly
  await expect(page.locator('h3.popover-title')).toContainText('Undisbursed Balances');

  // Step 6: Close the tooltip
  await page.getByRole('button', { name: 'Close' }).click();
});
