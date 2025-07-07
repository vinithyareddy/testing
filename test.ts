test('Verify Tooltip Icon is Present', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida', {
    waitUntil: 'domcontentloaded'
  });

  // Give extra time to stabilize
  await page.waitForLoadState('networkidle');

  const tooltip = page.locator('i.fas.fa-info-circle');

  await expect(tooltip).toBeVisible({ timeout: 10000 }); // increased timeout

  await expect(tooltip).toHaveScreenshot('oh-ibrd-ida-tooltip-icon.png');
});
