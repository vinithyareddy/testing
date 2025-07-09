test('Verify Net Flows (IBRD) Widget has Correct Title', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd', { waitUntil: 'domcontentloaded' });

  const widget = page.locator('[data-testid="net-flows-widget"]'); // Replace with accurate selector after inspection

  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toContainText('Net Flows (IBRD)', { timeout: 10000 });
});
