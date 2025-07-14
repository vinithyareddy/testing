test('Verify Include Subordinate Checkbox Works', async ({ page }) => {
  test.setTimeout(180000); // Allow 3 min for full page + panel load

  // Step 1: Go to the Budget at a Glance page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance');

  // Step 2: Wait and click the Filter Tab to open panel
  const filterTab = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.tagviewShow > lift-tag > div > div > label'
  );
  await filterTab.waitFor({ state: 'visible', timeout: 60000 });
  await filterTab.click();

  // Step 3: Locate the Include Subordinate checkbox
  const checkbox = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.right-trail-comp.refiner-sticky.refinerslide > app-budget-refiner > div > div.refiner-scroll.ng-tns-c237-13 > div input[type="checkbox"]'
  );

  // Step 4: Wait for checkbox to appear and interact
  await checkbox.waitFor({ state: 'visible', timeout: 60000 });
  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.check();

  // Step 5: Snapshot
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'sr-budget-glance-checkbox-checked.png' });
});
