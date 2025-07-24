test('verify view more - row dropdown', async ({ page }) => {
  // Wait for widget to be visible
  const widget = page.locator('app-plans-by-bussiness-process');
  await widget.waitFor({ state: 'visible', timeout: 15000 });
  await widget.scrollIntoViewIfNeeded();

  // Click "View More"
  const viewMore = page.getByText('View More', { exact: true });
  await viewMore.waitFor({ state: 'visible', timeout: 10000 });
  await viewMore.click();

  // Wait for ag-grid table to appear
  const agTable = page.locator('ag-grid-angular');
  await agTable.waitFor({ state: 'visible', timeout: 15000 });

  // Wait for dropdown icon in the first row (generic, non-brittle selector)
  const dropdownIcon = agTable.locator('span.ag-group-contracted >> nth=0');
  await dropdownIcon.waitFor({ state: 'visible', timeout: 10000 });

  // Scroll and click
  await dropdownIcon.scrollIntoViewIfNeeded();
  await dropdownIcon.click();

  // Screenshot after clicking dropdown
  await expect(page).toHaveScreenshot('sr-fp-vs-actual-businessprocess-view-more-dropdown-clicked.png');
});
