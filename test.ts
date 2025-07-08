test('Verify Net Flows (IBRD) Widget has Correct Title', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrdida');

  const widget = page.locator('app-net-flows');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  await expect(widget).toMatchAriaSnapshot(`
    - text: Net Flows (IBRD)
    - link:
    - /url: javascript:;
  `);
});
