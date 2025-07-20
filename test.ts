test('Verify Uses Breakdown widget Expand Icon is Clickable', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 20000 });

  // Find the expand icon by its alt image or nearest stable pattern — use role or tag structure
  const expandIcon = widget.locator('span.bgt-collabse-state img');

  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Click to expand
  await expandIcon.click();
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-uses-breakdown-widget-expanded.png');

  // Click to collapse
  await expandIcon.click();
  await page.waitForTimeout(1000);
});
