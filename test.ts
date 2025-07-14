test.describe('Budget at a Glance – Filter Panel Tests', () => {

  test('Open Filter Tab', async ({ page }) => {
    await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...');
    const filterTab = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.tagviewShow > lift-tag > div > div > label');
    await filterTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'sr-budget-glance-filter-opened.png' });
  });

  test('Verify Clear Option Works', async ({ page }) => {
    const clearBtn = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.right-trail-comp.refiner-sticky.refinerslide > app-budget-refiner > div > div.refiner-header.ng-tns-c237-13 > div > div:nth-child(2) > lift-button.p-1.ng-tns-c237-13 > button > span');
    await clearBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'sr-budget-glance-filter-clear-clicked.png' });
  });

  test('Verify Include Subordinate Checkbox Works', async ({ page }) => {
    const checkbox = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.right-trail-comp.refiner-sticky.refinerslide > app-budget-refiner > div > div.refiner-scroll.ng-tns-c237-13 > div input[type="checkbox"]');
    await checkbox.scrollIntoViewIfNeeded();
    await checkbox.check();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'sr-budget-glance-checkbox-checked.png' });
  });

  test('Verify Dropdown Option Expands', async ({ page }) => {
    const dropdown = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.right-trail-comp.refiner-sticky.refinerslide > app-budget-refiner > div > div.refiner-scroll.ng-tns-c237-13');
    await dropdown.locator('mat-expansion-panel').first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'sr-budget-glance-dropdown-expanded.png' });
  });

  test('Verify Apply Option Works', async ({ page }) => {
    const applyBtn = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.right-trail-comp.refiner-sticky.refinerslide > app-budget-refiner > div > div.refiner-header.ng-tns-c237-13 > div > div:nth-child(2) > lift-button:nth-child(2)');
    await applyBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'sr-budget-glance-filter-apply-clicked.png' });
  });

  test('Close Filter Tab', async ({ page }) => {
    const closeIcon = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.right-trail-comp.refiner-sticky.refinerslide > app-budget-refiner > div > div.refiner-header.ng-tns-c237-13 > div > div:nth-child(2) > span > i');
    await closeIcon.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'sr-budget-glance-filter-closed.png' });
  });

});
