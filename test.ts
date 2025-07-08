test('Verify Net Flows (IBRD+IDA) Widget has Title', async ({ page }) => {
  test.setTimeout(60000);
  try {
    await page.goto('https://mgmtqa.assetg.worldbank.org/operation_highlight/ibrdida');
    await page.waitForLoadState('networkidle');

    const ibrdTab = page.getByRole('tab', { name: /IBRD\+IDA/i });
    await expect(ibrdTab).toBeVisible();
    await ibrdTab.click();

    const widget = page.locator('#app-net-flows');
    await expect(widget).toBeVisible();
    await expect(widget).toMatchAriaSnapshot();
  } catch (error) {
    console.error('Error during Net Flows test:', error);
    throw error;
  }
});
