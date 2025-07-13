test('Verify WPBPG Expand Icon is Clickable', async ({ page }) => {
  test.setTimeout(120000); // Allow enough time for slow pages

  // Step 1: Navigate to the page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22%5D');

  // Step 2: Wait for widget
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  // Step 3: Scroll into view
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Step 4: Locate the expand icon reliably
  const expandIcon = widget.locator('i.bx-chevron-down');
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Step 5: Click to expand and take screenshot
  await expandIcon.click();
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-expanded.png');

  // Step 6: Click again to collapse and screenshot
  await expandIcon.click();
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-collapsed.png');
});
