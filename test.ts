test.beforeAll(async ({ page }) => {
  // Increase timeout if the page loads slowly
  test.setTimeout(120000); // 2 min for slow page + widgets

  // Load page with full timeout, waiting until network idle
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=...', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  // Optionally wait for a known key element (like widget or title)
  const keyWidget = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > div');
  await expect(keyWidget).toBeVisible({ timeout: 60000 });

  // Small buffer to let background JS finish
  await page.waitForTimeout(3000);
});
