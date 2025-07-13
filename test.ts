test('Verify Fullscreen Icon is Clickable in Work Program By Business Process Group Widget', async ({ page }) => {
  test.setTimeout(180000); // Set full test timeout to 3 mins

  // Step 1: Navigate to the Budget at a Glance page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22%5D');

  // Step 2: Wait for the widget to be present
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 120000 });

  // Step 3: Scroll widget into view
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000); // buffer for animation/rendering

  // Step 4: Locate the fullscreen icon within the widget
  const fullscreenIcon = widget.locator('span.view i');

  // Step 5: Make sure it's visible and clickable
  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });
  await fullscreenIcon.click();
  await page.waitForTimeout(3000); // wait for fullscreen effect

  // Step 6: Take screenshot for visual confirmation
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen-clicked.png', {
    timeout: 10000
  });
});
