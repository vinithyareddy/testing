test('Verify VPU Group Dropdown Expands', async ({ page }) => {
  test.setTimeout(60000);

  // Step 1: Wait for Filter tab to appear
  const filterTab = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > app-budget-glance > app-budget-top-header > div.right-trail.comp-refiner-sticky.refinerslide');
  await filterTab.waitFor({ state: 'visible', timeout: 10000 });

  await filterTab.click();
  await page.waitForTimeout(3000);

  // Step 2: Locate and click the dropdown for "VPU Group"
  const vpuDropdown = page.locator('div.item-title-title:has-text("VPU Group")');
  await vpuDropdown.scrollIntoViewIfNeeded();
  await vpuDropdown.click();

  await page.waitForTimeout(3000); // wait for dropdown animation if needed
});
