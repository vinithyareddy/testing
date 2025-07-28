test('Verify Final Plans vs Actuals by Responsible View (BB only) Title is Visible', async ({ page }) => {
  // Navigate with networkidle to ensure complete load
  await page.goto('https://standardreportsbetaqa.worldbank.org/work-program', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait for the widget container
  const widget = page.locator('app-burnrate');
  await expect(widget).toBeVisible({ timeout: 15000 });

  // Target the title within the widget
  const title = widget.locator('.widget-heading.pointer');
  await expect(title).toBeVisible({ timeout: 15000 });

  // Ensure it's scrolled into view before screenshot
  await title.scrollIntoViewIfNeeded();

  // Capture screenshot
  await expect(title).toHaveScreenshot('sr-fp-vs-actual-responsible-view-title-visible.png');
});
