test('Verify BB outcome by VPU Table is Visible', async ({ page }) => {
  // Step 1: Navigate to the page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance'); // Adjust if dynamic

  // Step 2: Wait for the widget to be visible
  const widget = page.locator('app-outcomebyvpu');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Step 3: Scroll the widget into view
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); // Allow rendering

  // Step 4: Locate any <table> inside the widget
  const table = widget.locator('table');
  await table.waitFor({ state: 'visible', timeout: 12000 });

  // Step 5: Screenshot the widget when table is visible
  await expect(widget).toHaveScreenshot('sr-budget-glance-bb-outcome-vpu-visible.png');
});
