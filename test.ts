test('Verify Fullscreen Icon is Clickable in Work Program By Business Process Group Widget', async ({ page }) => {
  test.setTimeout(180000); // Long timeout for slow loads

  // Step 1: Go to the Budget at a Glance page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22,%22bgi%251~N%22%5D');

  // Step 2: Locate widget
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 120000 });

  // Step 3: Scroll to widget
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  // ✅ Step 4: Locate fullscreen icon RELIABLY (relative to widget)
  const fullscreenIcon = widget.locator('span.view i'); // More stable
  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });

  // Step 5: Click to fullscreen
  await fullscreenIcon.click();
  await page.waitForTimeout(2000);

  // Step 6: Screenshot in fullscreen mode
  await expect(widget).toBeVisible({ timeout: 10000 });
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen-clicked.png');

  // ✅ Optional Step 7: Click again to exit fullscreen
  await fullscreenIcon.click();
  await page.waitForTimeout(2000);
});
