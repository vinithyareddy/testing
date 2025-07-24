test('verify view more - row dropdown', async ({ page }) => {
  // Wait for the widget to be visible
  const widget = page.locator('app-plans-vs-business-process');
  await expect(widget).toBeVisible({ timeout: 10000 });
  await widget.scrollIntoViewIfNeeded();

  // Wait for and click "View More"
  const viewMore = widget.getByText('View More', { exact: true });
  await expect(viewMore).toBeVisible({ timeout: 10000 });
  await viewMore.scrollIntoViewIfNeeded();
  await viewMore.click();

  // Wait for dropdown icon to appear dynamically (replaces hardcoded 12s wait)
  const dropdownIcon = page.locator(
    'div.ag-center-cols-container .ag-cell-focus span.ag-icon'
  );
  await expect(dropdownIcon.first()).toBeVisible({ timeout: 15000 });

  // Scroll and click
  await dropdownIcon.first().scrollIntoViewIfNeeded();
  await dropdownIcon.first().click();

  // Screenshot for confirmation
  await expect(page).toHaveScreenshot('sr-fp-vs-actual-businessprocess-view-more-dropdown-clicked.png');
});