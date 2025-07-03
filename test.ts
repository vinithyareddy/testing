test('Table loads multiple rows of data', async () => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');

  if (page.url().includes('login.microsoftonline.com')) {
    throw new Error('Not authenticated: redirected to login page.');
  }

  // Switch to Classic view
  await page.getByRole('link', { name: 'Classic' }).click();

  // Wait for at least one row to appear
  const tableRow = page.locator('table tbody tr');

  await expect(tableRow.first()).toBeVisible({ timeout: 10000 });

  const rowCount = await tableRow.count();
  expect(rowCount).toBeGreaterThan(3);
});
