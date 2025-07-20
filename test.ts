test('Verify currency toggle M/K and capture screenshots', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('networkidle');

  // Wait for toggle and click if needed
  const toggleSwitch = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > span'
  );

  await expect(toggleSwitch).toBeVisible({ timeout: 15000 });

  // Scroll to ensure widget renders
  const widget = page.locator('#Dashboard > div > div > div:nth-child(1) > div > app-source-users > div > div > div');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible();

  // Ensure it starts in "M" mode (toggle switch is ON)
  const isInM = await toggleSwitch.getAttribute('class');
  if (!isInM?.includes('switch-on')) {
    await toggleSwitch.click();
    await page.waitForTimeout(1000);
  }

  // Screenshot in Million (M) mode
  await expect(widget).toHaveScreenshot('sr-sources-widget-currency-M.png');

  // Toggle to Thousand (K)
  await toggleSwitch.click();
  await page.waitForTimeout(1000);

  // Screenshot in Thousand (K) mode
  await expect(widget).toHaveScreenshot('sr-sources-widget-currency-K.png');
});
