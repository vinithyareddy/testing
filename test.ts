test('Calendar input for As of Date is visible', async () => {
    await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
    await page.waitForLoadState('networkidle');
  
    // Click the date input
    const inputs = await page.locator('input[type="text"]').all();
    for (const input of inputs) {
      const val = await input.inputValue();
      if (val && val.includes('20')) {
        await input.click();
        break;
      }
    }
  
    // Screenshot for debug
    await page.screenshot({ path: 'calendar_debug.png', fullPage: true });
  
    // Wait for the popup — use known year or calendar container
    const calendarPopup = page.locator('.mat-datepicker-content, text=2025, text=Jul, text=Today');
    await expect(calendarPopup.first()).toBeVisible({ timeout: 7000 });
  });
  