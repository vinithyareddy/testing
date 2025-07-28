test('Verify Menu Tab Click Works', async ({ page }) => {
  await page.goto('https://standardreportsbetaqa.worldbank.org/work-program', {
    waitUntil: 'networkidle',
    timeout: 60000
  });
  const widget = page.locator('app-final-plans-budgetclass');
  await expect(widget).toBeVisible({ timeout: 15000 });
  const menuTab = widget.locator('mat-button-toggle-group button').first();
  await expect(menuTab).toBeVisible({ timeout: 15000 });
  await menuTab.scrollIntoViewIfNeeded();
  await menuTab.click();
  await page.waitForTimeout(500);
  await expect(menuTab).toHaveScreenshot('sr-fp-vs-actual-budgetclass-menu-tab.png');
});
