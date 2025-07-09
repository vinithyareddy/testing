test('Verify [Widget Name] Widget Title Tooltip', async ({ page }) => {
  // 1. Navigate to the correct page
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd');

  // 2. Locate widget by app-* component name
  const widget = page.locator('app-[widget-selector]'); // e.g., app-loan-equity-investment-outstanding

  // 3. Ensure widget heading is visible (title like "Loans Outstanding")
  await expect(widget.getByText('[Widget Title]')).toBeVisible({ timeout: 10000 }); // e.g., "Loans Outstanding"

  // 4. Scroll to ensure widget and tooltip icon are rendered
  await widget.scrollIntoViewIfNeeded();

  // 5. Find tooltip icon (lift-popover i tag inside heading)
  const tooltipIcon = widget.locator('lift-popover i');

  // 6. Wait for tooltip icon to be visible
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });

  // 7. Click the tooltip icon
  await tooltipIcon.click();

  // 8. Validate the popover heading
  await expect(page.locator('h3.popover-title')).toContainText('[Widget Title]', { timeout: 5000 });

  // 9. Click close button
  await page.getByRole('button', { name: 'Close' }).click();
});
