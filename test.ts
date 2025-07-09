test('Verify Gross Disbursements Widget Title Tooltip', async ({ page }) => {
  // Navigate to page
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd');

  // Wait for widget title text to be visible
  const widget = page.locator('app-gross-disbursements');
  await expect(widget.getByText('Gross Disbursements')).toBeVisible({ timeout: 10000 });

  // Find the info icon inside the widget (try different fallback selectors)
  const tooltipIcon = widget.locator('lift-popover i, lift-popover svg, lift-popover button, lift-popover a');

  // If multiple icons exist, you can also narrow by: .widget-heading lift-popover i
  await expect(tooltipIcon.first()).toBeVisible({ timeout: 10000 });

  // Click to open tooltip
  await tooltipIcon.first().click();

  // Assert tooltip content appears
  const tooltipTitle = page.locator('h3.popover-title');
  await expect(tooltipTitle).toContainText('Gross Disbursements', { timeout: 5000 });

  // Optional: close it
  const closeBtn = page.getByRole('button', { name: 'Close' });
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
});
