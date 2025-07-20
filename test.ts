test('Verify Sources Widget Expand Icon is Clickable', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  const widget = page.locator('#Dashboard > div > div > div:nth-child(1) > div > app-source-users > div > div > div');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Select the expand/collapse icon
  const expandIcon = page.locator('#Dashboard > div > div > div:nth-child(1) > div > app-source-users img[src$="arrow_down.png"]');
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Click expand
  await expandIcon.click();
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-sources-uses-widget-expanded.png');

  // Click collapse
  await expandIcon.click();
  await page.waitForTimeout(1000);
});
