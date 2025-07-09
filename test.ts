test('Verify Net Flows (IBRD) Widget Title Tooltip', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd');

  // Wait for the widget title to be visible
  const widget = page.locator('app-net-flows');
  await expect(widget.getByText('Net Flows (IBRD)')).toBeVisible({ timeout: 10000 });

  // Scroll to the widget area to ensure tooltip is rendered
  await widget.scrollIntoViewIfNeeded();

  // Find tooltip icon within the widget
  const tooltipIcon = widget.locator('lift-popover');

  // Wait for and click tooltip icon
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });
  await tooltipIcon.click();

  // Check tooltip content heading
  const tooltipTitle = page.locator('h3.popover-title');
  await expect(tooltipTitle).toContainText('Net Flows');

  // Close the tooltip
  const closeBtn = page.getByRole('button', { name: 'Close' });
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
});
