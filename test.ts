test.describe('Budget at a Glance', () => {
  test.beforeAll(async ({ page }) => {
    // Extend timeout for slower page loading
    test.setTimeout(60000);

    // Navigate to the page with full network load
    await page.goto(
      'https://standardreportsbetaqa.worldbank.org/budget-glance?filter=your-query-params-here',
      { waitUntil: 'networkidle' }
    );

    // Optional: Give time for widget data to render (especially charts/tables)
    await page.waitForTimeout(3000);
  });