test('IBRD+IDA page has correct title', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page).toHaveTitle('Management Dashboard');
  });

  test('Switch to Classic view tab', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'Classic' }).click();
    await expect(page.getByText('Other Metrics of Interest')).toBeVisible();
  });
  
  test('All Indicators dropdown expands', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByText('All Indicators').click();
    await expect(page.getByText('Primary Metrics')).toBeVisible(); // or another visible label
  });

  test('Indicator Approval Status slider works', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    const slider = await page.locator('input[type="range"]');
    await slider.focus();
    await slider.press('ArrowRight'); // Move the slider to the right
  });
  test('Calendar input for As of Date is visible', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByLabel('As of Date').click();
    await expect(page.getByRole('dialog')).toBeVisible(); // Calendar pop-up
  });
  test('Commitment metrics load properly', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('Total Commitment')).toBeVisible();
    await expect(page.getByText('Gross Disbursements')).toBeVisible();
  });
  test('Metrics table contains rows', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('FY25 Q3')).toBeVisible();
    await expect(page.getByText('FY24')).toBeVisible();
  });
  test('Top and bottom Download buttons visible', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    const buttons = await page.getByRole('button', { name: 'Download' });
    await expect(buttons).toHaveCount(2); // May vary; use `toBeVisible()` if needed
  });
  test('Tooltip info icon appears for metrics', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('ⓘ')).toBeVisible(); // If it’s implemented as text/icon
  });
  test('Search input below table is visible and accepts input', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    const input = page.getByPlaceholder('Search'); // or role: textbox
    await input.fill('FY24');
    await expect(input).toHaveValue('FY24');
  });
              