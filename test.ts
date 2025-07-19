test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses', {
    timeout: 90000,
    waitUntil: 'domcontentloaded',
  });

  const sourcesTitle = page.locator('text=Sources And Uses').nth(1); // pick the correct index after inspecting
  await expect(sourcesTitle).toBeVisible({ timeout: 20000 });

  const fullscreenIcon = page.locator('app-source-uses i.fa-expand'); // Adjust selector as needed
  await fullscreenIcon.waitFor({ state: 'visible', timeout: 15000 });
  await fullscreenIcon.click();

  await page.waitForTimeout(1000);
});
