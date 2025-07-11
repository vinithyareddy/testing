test('Verify Expand Icon is Clickable in Sources Widget', async ({ page }) => {
  // Wait until table rows are present = data loaded
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 20000 });

  const widget = page.locator('app-home-source-uses');
  await expect(widget).toBeVisible({ timeout: 5000 }); // now should work

  const expandIcon = page.locator(
    'app-home-source-uses img[title="Expand View"], app-home-source-uses img[alt*="Expand"], app-home-source-uses .bgt-collabse-state img'
  ).first();

  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Click to expand
  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-expanded.png');

  // Click to collapse
  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-collapsed.png');
});
