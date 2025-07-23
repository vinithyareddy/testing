test('Verify First Row Dropdown Expand', async ({ page }) => {
  // Step 1: Click "View More"
  const viewMoreButton = page.locator('#Dashboard app-missing-time .ng-trigger-collapse div:nth-child(2) > div');

  await expect(viewMoreButton).toBeVisible({ timeout: 10000 });
  await viewMoreButton.scrollIntoViewIfNeeded();
  await viewMoreButton.click();

  // Step 2: Wait for table to load
  const firstRowDropdown = page.locator('span.ag-icon.ag-icon-tree-closed').first();

  await expect(firstRowDropdown).toBeVisible({ timeout: 20000 });

  // Step 3: Click dropdown
  await firstRowDropdown.click();

  // Step 4: Screenshot
  await expect(firstRowDropdown).toHaveScreenshot('sr-trs-overview-missing-time-first-row-dropdown.png');
});
