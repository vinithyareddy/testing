test('verify view more - search option', async ({ page }) => {
  // Wait for widget to load
  await page.waitForTimeout(2000);

  const widget = page.locator('app-burndate');
  await expect(widget).toBeVisible({ timeout: 10000 });

  const viewmore = page.locator('dashboard-app-burndate >> div.ng-trigger-collapse >> div:nth-child(2) > div');

  // Scroll and wait for stability
  await viewmore.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // Allow animation/DOM stability

  // Optional: Freeze scroll temporarily to avoid bounce
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
  });

  // Try clicking via JS to avoid Playwright’s re-scroll
  try {
    await expect(viewmore).toBeVisible({ timeout: 5000 });

    const handle = await viewmore.elementHandle();
    if (!handle) throw new Error('ViewMore element detached before click');

    await page.evaluate(el => el.click(), handle);
  } catch (err) {
    console.error("Click failed:", err);
    await page.screenshot({ path: 'click-failure.png', fullPage: true });
    throw err;
  } finally {
    // Restore scroll after click
    await page.evaluate(() => {
      document.body.style.overflow = 'auto';
    });
  }

  // Wait for search bar and assert
  await page.waitForTimeout(2000);

  const searchbox = page.locator('filter-text-box');
  await expect(searchbox).toBeVisible({ timeout: 5000 });

  // Assertion (adapt to your actual logic)
  expect(await searchbox.isVisible()).toBeTruthy();

  // Screenshot
  await page.screenshot({ path: 'fp-vs-actual-responsible-view-more-search-option.png' });
});
