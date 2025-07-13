test('Verify Fullscreen Icon is Clickable in Work Program By Business Process Group Widget', async ({ page }) => {
  test.setTimeout(180000); // Set long timeout since page is slow

  // Step 1: Go to page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...'); // (shorten for brevity)

  // Step 2: Wait for widget
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 120000 });

  // Step 3: Scroll to widget
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000); // Let layout stabilize

  // Step 4: Locate and click fullscreen icon
  const fullscreenIcon = widget.locator('span.view i.bx-fullscreen');
  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });
  await fullscreenIcon.click();

  // Step 5: Wait for fullscreen effect
  await page.waitForTimeout(2000);

  // ✅ Step 6: Take screenshot after scrolling and visibility
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await expect(widget).toBeVisible({ timeout: 10000 });
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen-clicked.png', {
    timeout: 15000
  });
});
