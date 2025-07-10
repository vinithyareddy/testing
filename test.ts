test('Verify Sources and Uses Title is Visible', async ({ page }) => {
  const title = page.locator('text=Sources and Uses');
  await expect(title).toBeVisible();
  await expect(title).toHaveScreenshot('sr-budget-glance-sources-title-visible.png');
});
test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  const fullscreenIcon = page.locator('app-budget-glance app-budget-top-header + div button i.fa-expand');
  await expect(fullscreenIcon).toBeVisible();
  await fullscreenIcon.click();
  await page.waitForTimeout(500);
  await expect(fullscreenIcon).toHaveScreenshot('sr-budget-glance-sources-fullscreen-icon.png');
});
test('Verify Dropdown Icon beside Fullscreen in Sources Widget', async ({ page }) => {
  const dropdownIcon = page.locator('app-budget-glance app-budget-top-header + div button i.fa-ellipsis-v');
  await expect(dropdownIcon).toBeVisible();
  await dropdownIcon.click();
  await page.waitForTimeout(500);
  await expect(dropdownIcon).toHaveScreenshot('sr-budget-glance-sources-dropdown-clicked.png');
});
test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  const table = page.locator('table'); // You can scope this to a class if needed
  await expect(table).toBeVisible();
  await expect(table).toHaveScreenshot('sr-budget-glance-sources-table-visible.png');
});
test('Verify Sources Table Content for Known Department', async ({ page }) => {
  const dept = page.locator('text=ITSVP-Front Office');
  await expect(dept).toBeVisible();

  const forecastValue = page.locator('text=394.5'); // Adjust to use regex or partial match if needed
  await expect(forecastValue).toBeVisible();
});
test('Verify Expand Plus Icon inside Sources Table', async ({ page }) => {
  const plusIcon = page.locator('table i.fa-plus-circle'); // or span.icon-plus if different
  await expect(plusIcon.first()).toBeVisible();
  await plusIcon.first().click();
  await page.waitForTimeout(500);
  await expect(plusIcon.first()).toHaveScreenshot('sr-budget-glance-sources-plus-expanded.png');
});
test('Verify View More Button is Visible and Clickable', async ({ page }) => {
  const viewMore = page.getByRole('link', { name: 'View More' });
  await expect(viewMore).toBeVisible();
  await viewMore.click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/.*view-more.*/); // optional
});
