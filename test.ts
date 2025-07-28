test('Verify Final Plans vs Actuals by Business Process Title is Visible', async ({ page }) => {
  // Safe navigation
  await page.goto('https://standardreportsbetaqa.worldbank.org/work-program', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Wait for the widget container to be visible
  const widget = page.locator('#Dashboard app-plans-by-bussiness-process');
  await expect(widget).toBeVisible({ timeout: 15000 });

  // Wait for the title inside the widget
  const title = widget.locator('.widget-heading.pointer');
  await expect(title).toBeVisible({ timeout: 15000 });

  // Scroll title into view to avoid screenshot errors
  await title.scrollIntoViewIfNeeded();

  // Screenshot after everything is rendered
  await expect(title).toHaveScreenshot('sr-fp-vs-actual-businessprocess-title-visible.png');
});
