test('Verify Net Flows (IBRD+IDA) Widget is visible and has correct title', async ({ page }) => {
  // Step 1: Go to the IBRD+IDA page
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrdida', {
    waitUntil: 'domcontentloaded'
  });

  // Step 2: Wait for the sidebar or main container to ensure layout is loaded
  await page.waitForSelector('text=IBRD+IDA', { timeout: 10000 });

  // Step 3: Optional - Click IBRD+IDA tab if it exists and is clickable
  const tab = page.getByRole('tab', { name: /IBRD\+IDA/i });
  if (await tab.isVisible()) {
    await tab.click();
  }

  // Step 4: Scroll down to Net Flows widget
  const widget = page.locator('text=Net Flows (IBRD+IDA)');
  await widget.scrollIntoViewIfNeeded();

  // Step 5: Ensure widget container is visible (use id or outer div if more accurate)
  const widgetContainer = page.locator('#app-net-flows');
  await expect(widgetContainer).toBeVisible({ timeout: 10000 });

  // Step 6: Validate title via ARIA
  await expect(widgetContainer).toMatchAriaSnapshot();
});
