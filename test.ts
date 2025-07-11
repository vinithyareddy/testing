test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  test.setTimeout(90000); // allow 90s for slow dashboard

  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 30000 });

  // Wait for data
  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 30000 });

  const viewMore = page.getByRole('button', { name: 'View More' });
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.click();
  await page.waitForTimeout(1000); // optional animation wait
});


test('Verify Expand Plus Icon inside Sources Table', async ({ page }) => {
  test.setTimeout(90000); // dashboard is slow

  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 30000 });

  const widget = page.locator('app-home-source-uses');
  await expect(widget).toBeVisible({ timeout: 10000 });

  const plusIcon = widget.locator('table tbody tr:first-child td i.fa-plus');
  await plusIcon.scrollIntoViewIfNeeded();
  await expect(plusIcon).toBeVisible({ timeout: 10000 });

  await plusIcon.click();
  await expect(plusIcon).toHaveScreenshot('sr-budget-glance-sources-plus-expanded.png');
});

test('Verify Expand Icon is Clickable in Sources Widget', async ({ page }) => {
  test.setTimeout(90000); // full widget load + interaction

  await page.waitForSelector('app-home-source-uses table tbody tr', { timeout: 30000 });

  const widget = page.locator('app-home-source-uses');
  await expect(widget).toBeVisible({ timeout: 10000 });

  const expandIcon = page.locator(
    'app-home-source-uses img[title="Expand View"], app-home-source-uses img[alt*="Expand"], app-home-source-uses .bgt-collabse-state img'
  ).first();

  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-expanded.png');

  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-sources-collapsed.png');
});
test('Verify default filter selections in filter summary bar', async ({ page }) => {
  test.setTimeout(90000); // safe timeout for full banner load

  const filterButton = page.getByRole('button', { name: /filter/i });
  await filterButton.click();
  await page.waitForTimeout(1000);

  await page.waitForSelector('text=Fiscal Year', { timeout: 20000 });

  const fiscalYearTag = page.getByText('2025', { exact: false });
  await expect(fiscalYearTag).toBeVisible({ timeout: 10000 });

  const vpuTag = page.getByText('ITSVP', { exact: false });
  await expect(vpuTag).toBeVisible({ timeout: 10000 });

  const includeUnitTag = page.getByText('N', { exact: true });
  await expect(includeUnitTag).toBeVisible({ timeout: 10000 });

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  for (const month of months) {
    await expect(page.getByText(month)).toBeVisible({ timeout: 10000 });
  }

  await expect(page.locator('div')).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});
