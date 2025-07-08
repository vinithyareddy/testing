test('Verify Gross Outstanding Exposure Widget has Tab sections', async ({ page }) => {
  // Ensure page is loaded fully
  await page.goto('https://mgmta.estgp.worldbank.org/operation_highlight/miga');
  await page.waitForLoadState('domcontentloaded');

  // Use visible heading to scope the widget instead of custom tag
  const widget = page.getByRole('heading', { name: 'Gross outstanding exposure' }).locator('..'); // parent wrapper
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Now check all tab buttons using role=radio
  await expect(page.getByRole('radio', { name: 'FY TO DATE' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'QUARTER' })).toBeVisible();
  await expect(page.getByRole('radio', { name: '3 YEARS AVG.' })).toBeVisible();
});
