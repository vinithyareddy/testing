test('Verify Expand Plus Icon inside Sources Table', async ({ page }) => {
  test.setTimeout(60000); // increase timeout for slow dashboard

  // Wait for data in table to load
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 20000 });

  const widget = page.locator('app-home-source-uses');
  await expect(widget).toBeVisible({ timeout: 5000 });

  // Create fresh locator **after** table has rendered
  const plusIcon = widget.locator('table tbody tr:first-child td i.fa-plus');
  await plusIcon.scrollIntoViewIfNeeded();
  await expect(plusIcon).toBeVisible({ timeout: 10000 });

  await plusIcon.click();

  await expect(plusIcon).toHaveScreenshot('sr-budget-glance-sources-plus-expanded.png');
});
