test('Table loads multiple rows of data (via FY25 row check)', async () => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');

  // Login redirect check
  if (page.url().includes('login.microsoftonline.com')) {
    throw new Error('Not authenticated: redirected to login page.');
  }

  // Switch to Classic view
  await page.getByRole('link', { name: 'Classic' }).click();

  // Wait until expected row appears by text
  await expect(page.getByText('FY25')).toBeVisible({ timeout: 10000 });

  // Optional: Count rows if you have a valid locator (update below once DOM is known)
  // const rows = await page.locator('.some-table-row-class').count();
  // expect(rows).toBeGreaterThan(3);
});
