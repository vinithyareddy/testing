test('Verify Gross Outstanding Exposure Widget has Tab sections', async ({ page }) => {
  // Corrected URL
  await page.goto('https://mgmta.estgp.worldbank.org/operation_highlight/#/miga');
  await page.waitForLoadState('domcontentloaded');

  // Use heading to locate widget
  const heading = page.getByRole('heading', { name: 'Gross outstanding exposure' });
  await expect(heading).toBeVisible({ timeout: 10000 });

  // Check each tab
  await expect(page.getByRole('radio', { name: 'FY TO DATE' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'QUARTER' })).toBeVisible();
  await expect(page.getByRole('radio', { name: '3 YEARS AVG.' })).toBeVisible();
});
