test('Verify WPBPG Expand Icon is Clickable', async ({ page }) => {
  test.setTimeout(120000); // Extra time for slow rendering

  // Step 1: Go to the page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22%5D');

  // Step 2: Wait for widget to be visible
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 60000 });
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); // Let animation/scroll settle

  // Step 3: Locate the expand icon dynamically (avoid brittle selectors)
  const expandIcon = widget.locator('span.bgt-collabse-state >> img');
  await expect(expandIcon).toBeVisible({ timeout: 15000 });

  // Step 4: Screenshot before clicking (collapsed state)
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-collapsed.png');

  // Step 5: Click expand
  await expandIcon.click();
  await page.waitForTimeout(1000);

  // Step 6: Screenshot after expand
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-expanded.png');

  // Step 7: Click again to collapse (optional)
  await expandIcon.click();
  await page.waitForTimeout(1000);
});
