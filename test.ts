test('Verify Net Flows (IBRD+IDA) Widget has Title', async ({ page }) => {
  // Ensure correct tab is active before running snapshot
  const ibrdTab = page.getByRole('tab', { name: /IBRD\+IDA/i });
  await ibrdTab.click(); // Force switch to correct view

  const widget = page.locator('#app-net-flows');
  await expect(widget).toBeVisible(); // optional check

  await expect(widget).toMatchAriaSnapshot();
});
