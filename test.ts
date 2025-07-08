test('Verify Gross Outstanding Exposure Widget has Tab sections', async ({ page }) => {
  // Make sure the widget is visible first
  const widget = page.locator('app-commitments-guarantees');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Check each tab one by one
  await expect(widget.getByRole('radio', { name: 'FY TO DATE' })).toBeVisible();
  await expect(widget.getByRole('radio', { name: 'QUARTER' })).toBeVisible();
  await expect(widget.getByRole('radio', { name: '3 YEARS AVG.' })).toBeVisible();
});
