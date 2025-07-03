test('Switch back to Card view from Classic', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'Classic' }).click();
    await page.getByRole('link', { name: 'Card' }).click();
    await expect(page.getByText('Total Commitment')).toBeVisible();
  });
  test('Info tooltip appears on hover or click', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    const infoIcon = page.locator('text=Private Capital Mobilization >> .. >> [data-tooltip]');
    await infoIcon.hover(); // or `.click()` if tooltip is click-based
    await expect(page.locator('[role="tooltip"]')).toBeVisible();
  });
  test('Search bar filters results', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'Classic' }).click();
    const input = page.locator('input[placeholder="Search"]');
    await input.fill('FY24');
    await expect(page.getByText('FY24')).toBeVisible();
  });
  test('COLUMNS menu opens in Classic view', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'Classic' }).click();
    await page.getByRole('link', { name: 'COLUMNS' }).click();
    await expect(page.getByText('All Columns')).toBeVisible(); // or whatever appears
  });
  test('Two Download buttons are present', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    const buttons = await page.locator('button:has-text("Download")').all();
    expect(buttons.length).toBe(2);
  });
  test('Table loads multiple rows of data', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.getByRole('link', { name: 'Classic' }).click();
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(3);
  });
  test('Primary Metrics option in Indicators dropdown', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.locator('text=All Indicators').click();
    await expect(page.getByText('Primary Metrics')).toBeVisible();
  });
  test('Slider value changes on interaction', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    const slider = page.locator('input[type="range"]');
    const original = await slider.evaluate((el) => el.value);
    await slider.press('ArrowRight');
    const updated = await slider.evaluate((el) => el.value);
    expect(updated).not.toBe(original);
  });
  test('User profile icon visible in navbar', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.locator('img[alt="Profile"], .avatar')).toBeVisible();
  });
  test('Gross Disbursements shows 0.0B value', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await expect(page.getByText('0.0B')).toBeVisible();
  });
              