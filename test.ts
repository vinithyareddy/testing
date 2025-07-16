test('Verify Fullscreen Icon is Clickable in Work Program By Business Process Group Widget', async ({ page }) => {
  test.setTimeout(180000); // Extended timeout for slow page

  // Step 1: Navigate
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...'); // shortened for brevity

  // Step 2: Wait for and scroll to widget
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 120000 });
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000); // stabilize layout

  // Step 3: Locate fullscreen icon (relative)
  const fullscreenIcon = widget.locator('span.view i'); // safer and reusable
  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });

  // Step 4: Click fullscreen
  await fullscreenIcon.click();
  await page.waitForTimeout(2000); // give UI time to update

  // Step 5: Re-locate the fullscreen widget by new class/behavior
  const fullscreenPanel = page.locator('div.cdk-global-overlay-wrapper'); // or identify a new selector that appears only in fullscreen
  await expect(fullscreenPanel).toBeVisible({ timeout: 10000 });

  // Step 6: Screenshot
  await fullscreenPanel.scrollIntoViewIfNeeded();
  await expect(fullscreenPanel).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen-clicked.png', { timeout: 15000 });

  // Step 7 (optional): Exit fullscreen
  await fullscreenIcon.click();
  await page.waitForTimeout(2000);
});
