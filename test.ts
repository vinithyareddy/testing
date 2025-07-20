test('Verify Uses breakdown widget Expand Icon is Clickable', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 60000 });

  // Use relative locator inside the widget, based on known class
  const expandIcon = widget.locator('span.bgt-collabse-state img');

  await expect(expandIcon).toBeVisible({ timeout: 15000 });

  await expandIcon.click();
  await page.waitForTimeout(1000);

  await expect(widget).toHaveScreenshot('sr-uses-breakdown-widget-expanded.png');

  await expandIcon.click();
  await page.waitForTimeout(1000);
});
