test('"As of Date" input is visible', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.locator('input[type="date"]')).toBeVisible();
  });
  test('Indicator Approval Status label is present', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('Indicator Approval Status')).toBeVisible();
  });
  test('Indicator Approval Status has expected value', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    const value = await page.locator('input[type="range"]').evaluate(el => el.value);
    expect(value).toBe('36');
  });
  test('Total Commitment shows 0%', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('0%')).toBeVisible();
  });
  test('"FY TO DATE" tab is visible', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByRole('tab', { name: 'FY TO DATE' })).toBeVisible();
  });
  test('Commitment card shows label', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('Total Commitment')).toBeVisible();
  });
  test('o/w Guarantees text is visible in metrics', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('o/w Guarantees')).toBeVisible();
  });
  test('"Gross Disbursements" header is visible', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('Gross Disbursements')).toBeVisible();
  });
  test('Bottom download button appears in classic view', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'Classic' }).click();
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
  });
  test('Table contains FY25 Q3 text', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'Classic' }).click();
    await expect(page.getByText('FY25 Q3')).toBeVisible();
  });
  test('Private Capital Mobilization row appears', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'Classic' }).click();
    await expect(page.getByText('Private Capital Mobilization')).toBeVisible();
  });
              