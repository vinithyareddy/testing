test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  // 🔍 Optional: Debug logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('requestfailed', request =>
    console.log('❌ Request Failed:', request.url(), request.failure()?.errorText)
  );

  // ⚠️ DON'T use waitUntil: 'networkidle' — may never resolve
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=...', {
    waitUntil: 'domcontentloaded', // just ensure DOM is ready
  });

  // ⏳ Give page time to settle (especially if spinner stays)
  await page.waitForTimeout(3000);

  // ✅ Use a reliable static element (title or heading)
  await expect(page.getByText('Budget at a Glance', { exact: false })).toBeVisible({
    timeout: 10000,
  });

  await context.close();
});
