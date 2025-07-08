test('Verify Net Flows (IBRD+IDA) Widget has Title', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrdida');

  // ✅ Step 1: Force switch to correct tab
  const tab = page.getByRole('tab', { name: /IBRD\+IDA/i });
  await tab.click();

  // ✅ Step 2: Wait for the widget to be visible
  const widget = page.locator('#app-net-flows');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // ✅ Step 3: Take snapshot
  await expect(widget).toMatchAriaSnapshot();
});
