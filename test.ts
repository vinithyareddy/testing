test('Verify Uses Breakdown Widget Title is Visible', async ({ page }) => {
  test.setTimeout(90000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  // Target widget container
  const widget = page.locator('#Dashboard > div > div > div:nth-child(3) > div > app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Simpler and more resilient title locator inside widget
  const title = widget.locator('span.widget-heading');

  await expect(title).toBeVisible({ timeout: 10000 });
  await expect(title).toHaveScreenshot('sr-uses-breakdown-widget-title.png');
});
