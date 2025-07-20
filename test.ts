test('Verify Fullscreen Button in Uses breakdown Widget', async ({ page }) => {
  test.setTimeout(90000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  const widget = page.locator('#Dashboard > div > div > div:nth-child(3) > div > app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Use a more stable relative selector — selects the fullscreen icon <i> tag inside the widget
  const fullscreenIcon = widget.locator('span.view i');

  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });

  // Click to expand fullscreen
  await fullscreenIcon.click();
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-uses-breakdown-fullscreen-opened.png');

  // Click again to exit fullscreen
  await fullscreenIcon.click();
  await page.waitForTimeout(1000);
});
