test('Fixed Expenses title is visible', async ({ page }) => {
  await page.waitForTimeout(1000); // let widget load

  // Locate the title element by partial text and class
  const title = page.locator('div.widget-heading', { hasText: 'Fixed Expenses' });

  await expect(title).toBeVisible({ timeout: 10000 });

  // Take screenshot of just this title block
  await title.screenshot({ path: 'sr-sources-uses-breakdown-fixed-expenses-title.png' });
});
