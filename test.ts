test('verify view more - wraptext option', async ({ page }) => {
  // 1. Locate and ensure widget is visible
  const widget = page.locator('app-burnrate');
  await expect(widget).toBeVisible({ timeout: 15000 });

  // 2. Scroll to widget bottom and find "View More"
  const viewMore = widget.getByText('View More', { exact: true });
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  // 3. Click "View More"
  await viewMore.click();

  // 4. Wait for spinner/skeleton (if any) to disappear (adjust selector if needed)
  await page.waitForSelector('.spinner, .loading-skeleton, .ag-overlay-loading-wrapper', {
      state: 'detached',
      timeout: 15000
  }).catch(() => {});

  // 5. Now wait for Wrap Text checkbox to appear
  const wraptextcheckbox = page.locator('ul > li:nth-child(4) > input[type="checkbox"]'); // Simplified locator
  await expect(wraptextcheckbox).toBeVisible({ timeout: 10000 });

  // 6. Click checkbox
  await wraptextcheckbox.click();

  // 7. Take screenshot
  await wraptextcheckbox.screenshot({ path: 'screenshots/sr-fp-vs-actual-responsible-view-view-more-wrapcheckbox-option.png' });
});
