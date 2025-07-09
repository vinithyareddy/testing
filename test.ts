test.describe('Guarantees Widget', () => {
  const widgetSelector = '#print-section app-commitments-guarantees';

  test('Verify Guarantees Widget has Correct Title', async ({ page }) => {
    await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/miga');

    const widget = page.locator(widgetSelector);
    await widget.scrollIntoViewIfNeeded();
    await expect(widget).toBeVisible({ timeout: 10000 });
    await expect(widget.getByText('Guarantees', { exact: true })).toBeVisible();
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
    const radio = widget.getByRole('radio', { name: 'FY TO DATE' }).first();

    await radio.scrollIntoViewIfNeeded();
    await radio.click({ force: true });
    await page.waitForTimeout(1000);

    await expect(widget).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-FY-screenshot.png', {
      maxDiffPixelRatio: 0.03,
    });
  });

  test('Verify Guarantees Widget QUARTER section selected', async ({ page }) => {
    const widget = page.locator(widgetSelector);
    const radio = widget.getByRole('radio', { name: 'QUARTER' }).first();

    await radio.scrollIntoViewIfNeeded();
    await radio.click({ force: true });
    await page.waitForTimeout(1000);

    await expect(widget).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-quarter-screenshot.png', {
      maxDiffPixelRatio: 0.03,
    });
  });

  test('Verify Guarantees Widget 3 Years Avg section selected', async ({ page }) => {
    const widget = page.locator(widgetSelector);
    const radio = widget.getByRole('radio', { name: '3 YEARS AVG.' }).first();

    await radio.scrollIntoViewIfNeeded();
    await radio.click({ force: true });
    await page.waitForTimeout(1000);

    await expect(widget).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-3years-avg-screenshot.png', {
      maxDiffPixelRatio: 0.03,
    });
  });
});
