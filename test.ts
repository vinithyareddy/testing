test.beforeAll(async ({ page }) => {
  test.setTimeout(120000); // 2 min max

  // Step 1: Load page with full wait
  await page.goto(
    'https://standardreportsbetaqa.worldbank.org/budget-glance?filter=...',
    { waitUntil: 'networkidle', timeout: 60000 }
  );

  // Step 2: Fallback to more reliable locator
  const keyElement = page.locator('text=PROJECTED BB OUTCOME'); // or any guaranteed visible widget label
  await expect(keyElement).toBeVisible({ timeout: 40000 });

  await page.waitForTimeout(2000); // just to be safe
});
