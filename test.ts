test('Verify Gross outstanding exposure Widget FY TO DATE section selected', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/miga');

  const widget = page.locator(widgetSelector);

  // Narrow to correct instance by using widget context
  const radioButton = widget.getByRole('radio', { name: 'FY TO DATE' }).first();

  await radioButton.click({ force: true }); // prevent intercept error
  await page.waitForTimeout(1000); // allow UI to settle

  await expect(widget).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-FY-screenshot.png', {
    maxDiffPixelRatio: 0.03, // allow minor pixel shifts
  });
});
