test('Verify Loans Outstanding Widget Title Tooltip', async ({ page }) => {
  await page.waitForTimeout(2000);

  await page.locator('app-loan-equity-investment-outstanding').getByRole('link').click();

  await expect(page.locator('h3.popover-title')).toMatchAriaSnapshot(`
    - heading "Outstanding Loans, Equity Investment, Guarantees Close" [level=3]:
      - text: Outstanding Loans, Equity Investment, Guarantees
      - button "Close"
  `);

  await page.getByRole('button', { name: 'Close' }).click();
});
