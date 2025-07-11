test.beforeAll(async ({ page }) => {
  // Use longer timeout to prevent hook failures
  test.setTimeout(60000); // Optional: increase timeout for slow pages

  try {
    // Go to the page
    await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance', {
      waitUntil: 'domcontentloaded',
      timeout: 45000, // increased from default
    });

    // Optional: wait for a visible element that confirms page load
    await page.getByText('Budget at a Glance', { exact: false }).waitFor({ timeout: 10000 });

    // Wait for stable network and slight buffer
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(1000); // Give extra second for stability

  } catch (err) {
    console.error('❌ Error during beforeAll navigation:', err);
    await page.screenshot({ path: 'error-beforeAll-nav.png', fullPage: true });
    throw err; // rethrow to fail test
  }
});
