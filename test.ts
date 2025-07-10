test('Verify Expand Icon is Clickable in Sources Widget', async ({ page }) => {
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Ensure at least 1 row is rendered
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 10000 });

  const expandIcon = page.locator('app-home-source-uses img[title="Expand View"], app-home-source-uses img[alt*="Expand"], app-home-source-uses .bgt-collabse-state img').first();

  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-expanded.png');

  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-collapsed.png');
});
test('Verify Expand Plus Icon inside Sources Table', async ({ page }) => {
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Wait until table row renders
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 10000 });

  // Use relative selector (avoid full path)
  const plusIcon = widget.locator('table tbody tr:first-child td i.fa-plus');

  await plusIcon.scrollIntoViewIfNeeded();
  await expect(plusIcon).toBeVisible({ timeout: 5000 });

  await plusIcon.click();
  await expect(plusIcon).toHaveScreenshot('sr-budget-glance-sources-plus-expanded.png');
});
test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Confirm that data is rendered
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 10000 });

  const viewMore = page.getByRole('button', { name: 'View More' });
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.click();
  await page.waitForTimeout(500); // Optional: expansion effect
});
