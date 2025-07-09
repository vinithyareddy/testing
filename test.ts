test('Verify Loans Outstanding Widget Title Tooltip', async ({ page }) => {
  // 1. Navigate to the page
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd');

  // 2. Locate widget
  const widget = page.locator('app-loan-equity-investment-outstanding');

  // 3. Wait until the title is visible
  await expect(widget.getByText('Loans Outstanding')).toBeVisible({ timeout: 10000 });

  // 4. Scroll to ensure it's rendered
  await widget.scrollIntoViewIfNeeded();

  // 5. Find the tooltip icon
  const tooltipIcon = widget.locator('lift-popover i');

  // 6. Wait for the icon to be visible and click it
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });
  await tooltipIcon.click();

  // 7. Assert popover shows correct heading
  await expect(page.locator('h3.popover-title')).toContainText('Loans Outstanding', { timeout: 5000 });

  // 8. Close the tooltip
  await page.getByRole('button', { name: 'Close' }).click();
});
