test('Calendar input for As of Date is visible', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.waitForLoadState('networkidle'); // Wait until page is fully loaded
  
    // STEP 1: Find all text inputs and click the one that looks like a date
    const inputs = await page.locator('input[type="text"]').all();
    for (const input of inputs) {
      const val = await input.inputValue();
      if (val && val.includes('20')) { // Crude check: e.g., 'Jul 2, 2025'
        await input.click(); // click the calendar input
        break;
      }
    }
  
    // STEP 2: Check if calendar popup appears
    const calendar = page.locator('text=Cancel'); // Could also try 'text=Today' or 'text=Apply'
    await expect(calendar).toBeVisible({ timeout: 5000 }); // Adjust if it needs longer
  });
  