test('Verify Undisbursed Balances Widget Tooltip', async ({ page }) => {
  await page.goto('https://mgmtqa.aesetg.worldbank.org/operation_highlight/ibrd');

  const tooltipIcon = page.locator('app-undisbursed-balance lift-popover i');
  await tooltipIcon.scrollIntoViewIfNeeded();
  await expect(tooltipIcon).toBeVisible({ timeout: 5000 });
  await tooltipIcon.click();

  await expect(page.locator('h3.popover-title')).toContainText('Undisbursed Balances');
  await page.getByRole('button', { name: 'Close' }).click();
});
