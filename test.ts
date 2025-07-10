test('Verify Expand Icon is Clickable in Sources Widget', async ({ page }) => {
  // Wait for the widget to be visible
  await page.waitForSelector('app-home-source-uses', { timeout: 10000 });

  // Scroll into view to avoid lazy load issues
  const sourcesWidget = page.locator('app-home-source-uses');
  await sourcesWidget.scrollIntoViewIfNeeded();

  // Try locating the expand (fullscreen) icon using a smarter selector
  const expandIcon = page.locator('app-home-source-uses img[title="Expand View"], app-home-source-uses img[alt*="Expand"], app-home-source-uses .bgt-collabse-state img');

  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Click to expand
  await expandIcon.click();
  await page.waitForTimeout(1000); // wait for animation

  // Screenshot after expand
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-expanded.png');

  // Click again to collapse
  await expandIcon.click();
  await page.waitForTimeout(1000); // wait for collapse

  // Final screenshot after collapsing
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-collapsed.png');
});
