test.beforeAll(async ({ page }) => {
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...', {
    waitUntil: 'load',
    timeout: 60000,
  });

  // Wait for key content (title or widget)
  await page.waitForSelector('text=BB Outcome by VPU', {
    timeout: 60000,
    state: 'visible',
  });

  // Optional: wait for data rows to render
  await page.waitForSelector('table >> text=ITSVP', { timeout: 60000 });

  // Buffer just to be safe
  await page.waitForTimeout(3000);
});
