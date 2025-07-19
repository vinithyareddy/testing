test('Verify sources widget Expand Icon is Clickable', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  const widget = page.locator('app-source-users'); // simpler & robust
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Use relative locator inside widget
  const expandIcon = widget.locator('span.bgt-collabse-state img'); // use class name if unique

  await expect(expandIcon).toBeVisible({ timeout: 15000 });

  await expandIcon.click();
  await page.waitForTimeout(1000);

  await expect(widget).toHaveScreenshot('sr-sources-uses-widget-expanded.png');

  await expandIcon.click();
  await page.waitForTimeout(1000);
});
