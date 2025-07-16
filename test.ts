test('Verify default filter selections in filter summary bar', async ({ page }) => {
  test.setTimeout(90000);

  // Open dropdown if collapsed
  const dropdownToggle = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.banner-sticky.mt-n2.mb-n4.pl-0.pr-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > a'
  );

  await dropdownToggle.waitFor({ state: 'visible', timeout: 20000 });
  await dropdownToggle.scrollIntoViewIfNeeded();
  await dropdownToggle.click(); // ensures section is open

  // Now wait for the dropdown content section
  const dropdownSection = page.locator(
    'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.banner-sticky.mt-n2.mb-n4.pl-0.pr-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > div'
  );

  await dropdownSection.waitFor({ state: 'attached', timeout: 30000 });
  await expect(dropdownSection).toBeVisible({ timeout: 30000 });

  // Take screenshot or continue assertions
  await dropdownSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await expect(dropdownSection).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});
