test('Verify VPU Group Dropdown Expands', async ({ page }) => {
  test.setTimeout(60000);

  // Wait for filter tab to be visible
  const filterTab = page.locator('app-budget-refiner');
  await filterTab.waitFor({ state: 'visible', timeout: 10000 });

  // Locate and click the VPU Group dropdown icon
  const vpuDropdown = page.locator('i.fa-angle-down.ng-star-inserted');
  await vpuDropdown.first().scrollIntoViewIfNeeded();
  await vpuDropdown.first().click();

  // Wait for dropdown to expand (check for content that appears after click)
  await expect(page.locator('text=Select a VPU Group')).toBeVisible(); // adjust this text if needed
});
