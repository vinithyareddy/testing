test.describe('Guarantees Widget', () => {

  const widgetSelector = '#print-section app-loan-equity-investment-outstanding';

  test('Verify Guarantees Widget has Correct Title', async ({ page }) => {
    await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/miga');

    const widget = page.locator(widgetSelector);
    await widget.scrollIntoViewIfNeeded();
    await expect(widget).toBeVisible({ timeout: 10000 });
    await expect(widget.getByText('Guarantees')).toBeVisible();
  });

  test('Verify Guarantees Widget has Tab sections', async ({ page }) => {
    const widget = page.locator(widgetSelector);
    await expect(widget).toMatchAriaSnapshot(`
    - radio "FY TO DATE"
    - text: FY TO DATE
    - radio "QUARTER"
    - text: QUARTER
    - radio "3 YEARS AVG."
    `);
  });

  test('Verify Guarantees Widget Title Tooltip', async ({ page }) => {
    const widget = page.locator(widgetSelector);
    await page.waitForTimeout(2000);

    await widget.getByRole('link').click();
    await expect(page.locator('h3.popover-title')).toMatchAriaSnapshot(`
    - heading "Guarantees Close" [level=3]:
          - button "Close"
    `);
    await page.getByRole('button', { name: 'Close' }).click();
  });

  test('Verify Guarantees Widget FY TO DATE section selected', async ({ page }) => {
    const widget = page.locator(widgetSelector);
    await widget.getByText('FY TO DATE').click();
    await expect(widget).toHaveScreenshot('oh-miga-card-app-loan-equity-investment-outstanding-FY-screenshot.png');
  });

  test('Verify Guarantees Widget QUARTER section selected', async ({ page }) => {
    const widget = page.locator(widgetSelector);
    await widget.getByText('QUARTER').click();
    await expect(widget).toHaveScreenshot('oh-miga-card-app-loan-equity-investment-outstanding-quarter-screenshot.png');
  });

  test('Verify Guarantees Widget 3 Years Avg section selected', async ({ page }) => {
    const widget = page.locator(widgetSelector);
    await widget.getByText('YEARS AVG.').click();
    await expect(widget).toHaveScreenshot('oh-miga-card-app-loan-equity-investment-outstanding-3years-avg-screenshot.png');
  });

});
