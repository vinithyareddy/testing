test('Search input below table is visible and accepts input', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=Commitments');
  
    const inputs = page.locator('input[placeholder="Search"]');
    console.log('Search inputs found:', await inputs.count());
  
    const input = inputs.first(); // Try .nth(0) or .nth(1) if needed
    await input.waitFor({ state: 'visible', timeout: 15000 });
  
    await input.fill('FY24');
    await expect(input).toHaveValue('FY24');
  });
  