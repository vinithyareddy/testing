test('Verify Projected BB Outcome Widget in $M and $K modes', async ({ page }) => {
  test.setTimeout(60000); // Safety timeout

  // Wait for the currency toggle to appear
  const currencyToggle = page.locator('input[type="checkbox"]'); // Adjust if needed
  await expect(currencyToggle).toBeVisible({ timeout: 10000 });

  // Ensure it's in $M first
  if (!(await currencyToggle.isChecked())) {
    await currencyToggle.check(); // Toggle to $M
  }

  // Wait for Projected BB Outcome widget to be visible
  const bbOutcomeWidget = page.getByText('PROJECTED BB OUTCOME', { exact: false }).locator('..'); // or a better container selector
  await expect(bbOutcomeWidget).toBeVisible({ timeout: 10000 });

  // Screenshot in $M mode
  await bbOutcomeWidget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Let it settle
  await expect(bbOutcomeWidget).toHaveScreenshot('bb-outcome-widget-M-mode.png');

  // Toggle to $K
  await currencyToggle.uncheck();
  await page.waitForTimeout(1000); // Allow widget to re-render

  // Screenshot in $K mode
  await bbOutcomeWidget.scrollIntoViewIfNeeded();
  await expect(bbOutcomeWidget).toHaveScreenshot('bb-outcome-widget-K-mode.png');
});
