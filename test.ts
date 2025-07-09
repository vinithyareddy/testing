test('Verify Gross outstanding exposure Widget FY TO DATE section selected', async ({ page }) => {
  const widget = page.locator(widgetSelector);

  await widget.getByRole('radio', { name: 'FY TO DATE' }).scrollIntoViewIfNeeded(); // optional but safe
  await page.waitForTimeout(1000); // Wait for DOM to stabilize
  await widget.getByRole('radio', { name: 'FY TO DATE' }).click({ force: true }); // avoid pointer interception

  await expect(widget).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-FY-screenshot.png', {
    maxDiffPixelRatio: 0.03, // allow minor diffs
  });
});
