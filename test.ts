test('Verify Gross Outstanding Exposure Widget Title Tooltip', async ({ page }) => {
  // Wait for widget to appear
  const widget = page.locator('app-commitments-guarantees');
  await expect(widget).toBeVisible();

  // Find the tooltip icon by accessible name
  const tooltipIcon = widget.locator('span.widget-heading img[title="info"]');

  // Ensure it is visible
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });

  // Click the tooltip icon
  await tooltipIcon.click();

  // Verify the tooltip heading
  await expect(page.locator('h3.popover-title')).toContainText('Gross outstanding exposure');

  // Close the tooltip popup
  await page.getByRole('button', { name: 'Close' }).click();
});
