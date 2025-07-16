test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  // Extend default test timeout
  test.setTimeout(90000);

  // Wait for the widget to be attached and visible
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  // Scroll into view and ensure layout is stable
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); // wait for render to settle

  // Locate fullscreen expand icon
  const expandIcon = page.locator(
    'app-home-source-uses img[title="Expand"], app-home-source-uses img[alt*="Expand"], app-home-source-uses .bgt-collabse-state img'
  );

  await expect(expandIcon).toBeVisible({ timeout: 10000 });
  await expandIcon.click();

  // Wait for expanded view
  await page.waitForTimeout(1000); // adjust if needed

  // Take screenshot of expanded state
  await expect(widget).toHaveScreenshot('sr-budget-glance-sources-expanded.png');

  // Collapse the widget back
  await expandIcon.click();
  await page.waitForTimeout(500);
});
