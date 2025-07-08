test.describe('Gross Outstanding Exposure Widget', () => {

  test('Verify Gross Outstanding Exposure Widget has Title', async ({ page }) => {
    const widget = page.locator('app-commitments-guarantees');
    await widget.scrollIntoViewIfNeeded();
    await expect(widget.getByText('Gross outstanding exposure')).toBeVisible();
  });

  test('Verify Gross Outstanding Exposure Widget has Tab sections', async ({ page }) => {
    await expect(page.locator('app-commitments-guarantees')).toMatchAriaSnapshot(`
      - radio "FY TO DATE"
      - text: FY TO DATE
      - radio "QUARTER"
      - text: QUARTER
      - radio "3 YEARS AVG."
    `);
  });

  test('Verify Gross Outstanding Exposure Widget Title Tooltip', async ({ page }) => {
    await page.waitForTimeout(1000);
    await page.locator('app-commitments-guarantees').getByRole('link').click();
    await expect(page.locator('h3.popover-title')).toMatchAriaSnapshot(`
      - heading "Gross Outstanding Close" [level=3]:
        - button "Close"
    `);
    await page.getByRole('button', { name: 'Close' }).click();
  });

  test('Verify Gross Outstanding Exposure FY TO DATE section selected', async ({ page }) => {
    await page.locator('app-commitments-guarantees').getByText('FY TO DATE').click();
    await expect(page.locator('app-commitments-guarantees')).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-FY-screenshot.png');
  });

  test('Verify Gross Outstanding Exposure QUARTER section selected', async ({ page }) => {
    await page.locator('app-commitments-guarantees').getByText('QUARTER').click();
    await expect(page.locator('app-commitments-guarantees')).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-quarter-screenshot.png');
  });

  test('Verify Gross Outstanding Exposure 3 Years Avg section selected', async ({ page }) => {
    await page.locator('app-commitments-guarantees').getByText('3 YEARS AVG.').click();
    await expect(page.locator('app-commitments-guarantees')).toHaveScreenshot('oh-miga-card-app-commitments-guarantees-3years-avg-screenshot.png');
  });

});