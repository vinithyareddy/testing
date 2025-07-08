test('Verify Gross Outstanding Exposure Widget Title Tooltip', async ({ page }) => {
  // Go to the page explicitly (you missed this earlier)
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/miga');

  // Define a reliable scoped selector
  const tooltipIcon = page.locator(
    'app-commitments-guarantees img[title="info"], app-commitments-guarantees i[title="info"]'
  );

  // Wait for icon to appear
  await expect(tooltipIcon).toBeVisible({ timeout: 10000 });

  // Click the tooltip icon
  await tooltipIcon.click();

  // Check tooltip heading text
  await expect(page.locator('h3.popover-title')).toContainText('Gross outstanding exposure');

  // Close the tooltip
  await page.getByRole('button', { name: /close/i }).click();
});
