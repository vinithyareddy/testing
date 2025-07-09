test('Verify Gross Disbursements Widget Title Tooltip', async ({ page }) => {
  // 1. Go to the page
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd');

  // 2. Wait for the widget title to ensure it's rendered
  const widget = page.locator('app-gross-disbursements');

  await expect(widget.getByText('Gross Disbursements')).toBeVisible({ timeout: 10000 });

  // 3. Find the tooltip icon (ⓘ)
  const tooltipIcon = widget.locator('i[class*=info], svg[aria-label="info"], .fa-info-circle'); // be flexible here

  // Ensure tooltip icon is visible and click
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });
  await tooltipIcon.click();

  // 4. Check the tooltip appears
  const tooltipTitle = page.locator('h3.popover-title');
  await expect(tooltipTitle).toContainText('Gross Disbursements', { timeout: 5000 });

  // 5. Close the tooltip (optional)
  const closeButton = page.locator('button:has-text("Close")');
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
});
