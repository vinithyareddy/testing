test('Verify WPBPG Title is Visible', async ({ page }) => {
  // 1. Set higher global test timeout
  test.setTimeout(180000); // 3 minutes max for full test

  // 2. Go to target page
  await page.goto('https://standardreportsbeta.worldbank.org/budget-glance'); // Adjust if different

  // 3. Wait for main widget container to appear
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'attached', timeout: 120000 }); // Widget DOM attached

  await expect(widget).toBeVisible({ timeout: 120000 }); // Fully visible

  // 4. Use plain text locator instead of role-based heading (in case heading isn't semantic)
  const title = widget.locator('text=Work Program By Business Process Group');

  await expect(title).toBeVisible({ timeout: 120000 });

  // 5. Capture screenshot
  await expect(title).toHaveScreenshot('sr-budget-glance-wpbpg-title.png');
});
