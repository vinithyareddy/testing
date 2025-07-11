
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext({
    // Optional: load previously saved login state
    storageState: 'auth.json', // only if you're using a logged-in session
  });
  const page = await context.newPage();

  // 🔍 Debugging listeners
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('requestfailed', request =>
    console.log('❌ Request Failed:', request.url(), request.failure()?.errorText)
  );
  page.on('response', response => {
    if (!response.ok())
      console.log(`⚠️ Bad response [${response.status()}]`, response.url());
  });

  // 🚀 Navigate to target page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=...', {
    waitUntil: 'domcontentloaded', // don't wait for all JS requests if blocking
  });

  // ⏳ Add buffer time for app init
  await page.waitForTimeout(3000);

  // ✅ Optional: wait for known widget or static text
  await expect(
    page.getByText('BB Outcome by VPU', { exact: true })
  ).toBeVisible({ timeout: 10000 });

  // Save session if needed
  await context.storageState({ path: 'auth.json' });

  await page.close();
  await context.close();
});
