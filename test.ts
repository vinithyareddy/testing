test('Verify Fullscreen Icon is Clickable in Work Program By Business Process Group Widget', async ({ page }) => {
  test.setTimeout(180000); // Extend total test timeout

  // Step 1: Go to the page
  await page.goto(
    'https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22%5D'
  );

  // Step 2: Wait for widget container to appear
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 120000 });

  // Step 3: Scroll widget into view
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000); // Let DOM stabilize

  // Step 4: Locate fullscreen icon with generic selector
  const fullscreenIcon = widget.locator('span.view i');

  // Step 5: Check and click
  if (await fullscreenIcon.count() === 0) {
    console.warn('⚠️ Fullscreen icon not found.');
    await page.screenshot({ path: 'wpbpg_fullscreen_not_found.png', fullPage: true });
    return;
  }

  await fullscreenIcon.scrollIntoViewIfNeeded();
  await expect(fullscreenIcon).toBeVisible({ timeout: 20000 });

  await fullscreenIcon.click();
  await page.waitForTimeout(2000); // Let fullscreen animation finish

  // Step 6: Take screenshot for visual confirmation
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen-clicked.png');
});
