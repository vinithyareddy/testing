test('Verify Temp Codes Title is Visible', async ({ page }) => {
  await page.goto('https://standardreportsbetaqa.worldbank.org/work-program', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
    const widget = page.locator('app-temp-code');
  await expect(widget).toBeVisible({ timeout: 15000 });
  const title = widget.locator('.widget-heading.pointer');
  await expect(title).toBeVisible({ timeout: 15000 });
  await title.scrollIntoViewIfNeeded();
  await expect(title).toHaveScreenshot('sr-wpa-temp-code-title-visible.png');
});
