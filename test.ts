test('Verify Dropdown Option Expands', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/sources-uses');
  await page.waitForLoadState('domcontentloaded');

  // Filter Tab — use stable, scoped selector
  const filterTab = page.locator('app-budget-top-header span.tagviewShow');
  await filterTab.waitFor({ state: 'visible', timeout: 60000 });
  await filterTab.click();

  // Wait for panel to slide out
  await page.waitForTimeout(3000);

  // Dropdown (e.g., Fund Center)
  const dropdownArrow = page.locator('lift-accordion:nth-child(2) lift-accordion-item a div.item-arrow > i');
  await dropdownArrow.waitFor({ state: 'visible', timeout: 60000 });
  await dropdownArrow.click();
  await page.waitForTimeout(1000); // wait for expand

  // Take screenshot of expanded state
  await page.screenshot({ path: 'screenshots/sr-budget-glance-filter-dropdown.png', fullPage: true });

  // Collapse the dropdown again
  await dropdownArrow.click();
  await page.waitForTimeout(1000);

  // Close panel
  const closeIcon = page.locator('app-budget-refiner i.fa-times');
  await closeIcon.waitFor({ state: 'visible', timeout: 60000 });
  await closeIcon.click();

  await page.waitForTimeout(3000);
});
