test('Verify Net Flows (IBRD) Widget Title Tooltip', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd');

  const widget = page.locator('app-net-flows');
  await expect(widget.getByText('Net Flows (IBRD)')).toBeVisible({ timeout: 10000 });

  await widget.scrollIntoViewIfNeeded();

  // NEW: Find lift-popover icon inside the widget
  const tooltipIcon = widget.locator('lift-popover >> i');

  // Wait for and click tooltip icon
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });
  await tooltipIcon.click();

  // Assert tooltip heading
  await expect(page.locator('h3.popover-title')).toContainText('Net Flows');

  // Close tooltip if visible
  const closeBtn = page.getByRole('button', { name: 'Close' });
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
});
