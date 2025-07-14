test('Verify Clear Option Works', async ({ page }) => {
  test.setTimeout(180000); // extend for slow loading

  // Step 1: Navigate directly
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance');

  // Step 2: Wait for and open Filter tab
  const filterTab = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.tagviewShow > lift-tag > div > div > label');
  await filterTab.waitFor({ state: 'visible', timeout: 60000 });
  await filterTab.click();

  // Step 3: Wait for Clear button to appear
  const clearBtn = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.right-trail-comp.refiner-sticky.refinerslide > app-budget-refiner > div > div.refiner-header.ng-tns-c237-13 > div > div:nth-child(2) > lift-button.p-1.ng-tns-c237-13 > button > span');
  await clearBtn.waitFor({ state: 'visible', timeout: 60000 });

  // Step 4: Click and validate
  await clearBtn.click();
  await page.waitForTimeout(2000); // small pause for clearing effect

  // Step 5: Screenshot after clear click
  await page.screenshot({ path: 'sr-budget-glance-filter-clear-clicked.png' });
});
