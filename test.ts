test('Apply Fund Center Filter', async ({ page }) => {
  test.setTimeout(120000); // Increase timeout for safety

  // Step 1: Go to page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22,%22bg1%252~ITSVP%22%5D');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000); // Wait for dashboard UI to load

  // Step 2: Click Filter Tab
  const filterTab = page.locator('span.tagviewShow lift-tag div label div');
  await filterTab.waitFor({ state: 'visible', timeout: 10000 });
  await filterTab.click();
  await page.waitForTimeout(2000);

  // Step 3: Expand Fund Center dropdown
  const fundCenterArrow = page.locator('lift-accordion:nth-child(3) a div.item-arrow > i');
  await fundCenterArrow.waitFor({ state: 'visible', timeout: 10000 });
  await fundCenterArrow.click();
  await page.waitForTimeout(1500);

  // Step 4: Open Select Fund Center dropdown
  const selectDropdown = page.locator('angular2-multiselect div.selected-list > div');
  await selectDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await selectDropdown.click();
  await page.waitForTimeout(1500);

  // Step 5: Select first checkbox option
  const firstCheckbox = page.locator('angular2-multiselect .dropdown-list ul > li:nth-child(1) > label');
  await firstCheckbox.waitFor({ state: 'visible', timeout: 10000 });
  await firstCheckbox.click();
  await page.waitForTimeout(1000);

  // Step 6: Take screenshot of filter with checkbox checked
  await expect(page).toHaveScreenshot('sr-filter-panel-checkbox-checked.png');

  // Step 7: Click Apply button
  const applyBtn = page.locator('lift-button:nth-child(2) button');
  await applyBtn.waitFor({ state: 'visible', timeout: 10000 });
  await applyBtn.click();

  // Optional: wait for result to settle
  await page.waitForTimeout(3000);
});
