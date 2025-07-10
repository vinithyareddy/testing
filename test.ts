test('Verify Expand Icon is Clickable in Sources Widget', async ({ page }) => {
  // Wait for widget to appear
  await page.waitForSelector('app-home-source-uses', { timeout: 10000 });

  // Scroll widget into view in case it's offscreen
  const sourcesWidget = page.locator('app-home-source-uses');
  await sourcesWidget.scrollIntoViewIfNeeded();

  // Flexible selector to target the expand icon image
  const expandIcon = page
    .locator(
      'app-home-source-uses img[title="Expand View"], app-home-source-uses img[alt*="Expand"], app-home-source-uses .bgt-collabse-state img'
    )
    .first();

  // Confirm it's found and visible
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Click to expand
  await expandIcon.click();
  await page.waitForTimeout(1000); // optional animation wait

  // Screenshot after expanding
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-expanded.png');

  // Click again to collapse
  await expandIcon.click();
  await page.waitForTimeout(1000); // wait for collapse

  // Final screenshot
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-collapsed.png');
});
