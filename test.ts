test('IBRD+IDA sidebar menu item is visible', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByRole('link', { name: 'IBRD+IDA' })).toBeVisible();
  });
  test('Sidebar link IBRD navigates correctly', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'IBRD' }).click();
    await expect(page).toHaveURL(/ibrd$/);
  });
  test('Sidebar link MIGA navigates correctly', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'MIGA' }).click();
    await expect(page).toHaveURL(/miga$/);
  });
  