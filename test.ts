test('Verify Dropdown Option Expands', async ({ page }) => {
  test.setTimeout(180000);

  const filterTab = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.tagviewShow > lift-tag > div > div > label'
  );

  await filterTab.waitFor({ state: 'visible', timeout: 90000 });
  await filterTab.scrollIntoViewIfNeeded();
  await filterTab.click({ force: true });

  const dropdown = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-trs-staffcost > app-budget-top-header > div.right-trail-comp.refiner-sticky.refinerslide > app-budget-refiner > div > div.refiner-scroll.ng-tns-c242-43 > lift-accordion:nth-child(2) > div > lift-accordion-item > div > a > div.item-arrow > i'
  ).first();

  await dropdown.waitFor({ state: 'visible', timeout: 60000 });
  await dropdown.scrollIntoViewIfNeeded();
  await dropdown.click();

  await page.waitForTimeout(2000); // allow dropdown to animate

  await expect(dropdown).toHaveScreenshot('sr-trs-filter-dropdown.png');
});
