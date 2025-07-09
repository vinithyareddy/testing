test('Verify Guarantees Widget FY TO DATE section selected', async ({ page }) => {
  const widget = page.locator(widgetSelector);
  await widget.getByText('FY TO DATE').click();
  await page.waitForTimeout(1000); // let it settle
  await widget.scrollIntoViewIfNeeded();

  await expect(widget).toHaveScreenshot('oh-miga-card-app-equity-investment-outstanding-FY-screenshot.png', {
    maxDiffPixelRatio: 0.03,
  });
});
