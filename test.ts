test('Verify default filter selections in filter summary bar', async ({ page }) => {
  // Set generous timeout for slow loading pages
  test.setTimeout(120000);

  // Step 1: Confirm page title
  await expect(page).toHaveTitle(/Budget-Glance/i);

  // Step 2: Click filter dropdown (accordion open)
  const filterToggle = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.banner-sticky.mt-n2.mb-n4.pl-0.pr-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > a > div.item-title-text.flex-grow-1 > div'
  );
  await filterToggle.click();
  await page.waitForTimeout(2000); // Allow expansion

  // Step 3: Wait for dropdown area to be visible
  const dropdownSection = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.banner-sticky.mt-n2.mb-n4.pl-0.pr-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > div'
  );
  await expect(dropdownSection).toBeVisible({ timeout: 30000 });

  // Step 4: Validate Fiscal Year tag
  const fiscalYearTag = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.banner-sticky.mt-n2.mb-n4.pl-0.pr-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > div > div > div:nth-child(1)'
  );
  await expect(fiscalYearTag).toBeVisible({ timeout: 30000 });
  await fiscalYearTag.scrollIntoViewIfNeeded();

  // Step 5: Validate VPU tag
  const vpuTag = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.banner-sticky.mt-n2.mb-n4.pl-0.pr-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > div > div > div:nth-child(2)'
  );
  await expect(vpuTag).toBeVisible({ timeout: 30000 });

  // Step 6: Validate Include His Unit tag
  const includeUnitTag = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.banner-sticky.mt-n2.mb-n4.pl-0.pr-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > div > div > div:nth-child(3)'
  );
  await expect(includeUnitTag).toBeVisible({ timeout: 30000 });

  // Step 7: Validate Posting Period months (div:nth-child(4))
  const postingPeriod = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.banner-sticky.mt-n2.mb-n4.pl-0.pr-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > div > div > div:nth-child(4)'
  );
  await expect(postingPeriod).toBeVisible({ timeout: 30000 });

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  for (const month of months) {
    const tag = postingPeriod.getByText(month, { exact: true });
    await expect(tag).toBeVisible({ timeout: 10000 });
  }

  // Step 8: Final Screenshot
  await dropdownSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); // Settle animation/render
  await expect(dropdownSection).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});
