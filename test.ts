test('Verify Gross outstanding exposure Widget 3 Years Avg section selected', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/miga');

  const widget = page.locator(widgetSelector);

  const radioButton = widget.getByRole('radio', { name: '3 YEARS AVG.' }).first();

  await radioButton.click({ force: true });
  await page.waitForTimeout(1000); // let it settle

  await expect(widget).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-3years-avg-screenshot.png', {
    maxDiffPixelRatio: 0.03,
  });
});
