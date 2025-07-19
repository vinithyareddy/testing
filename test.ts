test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded'); // waits until DOM is ready

  // More reliable: wait for unique widget content text (like "Sources And Uses")
  await expect(page.locator('text=Sources And Uses')).toBeVisible({ timeout: 20000 });

  // Use a robust selector for the fullscreen icon inside 'app-source-uses'
  const fullscreenIcon = page.locator('app-source-uses i.fa-expand'); // Replace 'fa-expand' with actual icon class if different

  await fullscreenIcon.waitFor({ state: 'visible', timeout: 15000 });

  await fullscreenIcon.click();
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({ path: 'screenshots/sr-sources-uses-fullscreen-icon.png', fullPage: false });
});
