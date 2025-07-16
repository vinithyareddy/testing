test('Verify Dropdown Option Can Be Selected and Applied', async ({ page }) => {
  test.setTimeout(120000);

  // Step 1: Navigate
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  // Step 2: Open filter panel if collapsed
  const filterBtn = page.locator('span.tagviewShow lift-tag > div > div > label > div');
  if (await filterBtn.isVisible()) {
    await filterBtn.click();
    await page.waitForTimeout(4000);
  }

  // Step 3: Expand Fund Center dropdown
  const dropdownToggle = page.locator(
    'lift-accordion:nth-child(3) > div > lift-accordion-item > div > a'
  );
  await dropdownToggle.click();
  await page.waitForTimeout(2000);

  // Step 4: Click "Select Fund Center"
  const selectFundInput = page.locator(
    'angular2-multiselect > div > div.selected-list > div'
  );
  await selectFundInput.waitFor({ state: 'visible', timeout: 10000 });
  await selectFundInput.click();
  await page.waitForTimeout(2000);

  // Step 5: Check first visible option (e.g., CEUTH)
  const ceuthCheckbox = page.locator(
    'angular2-multiselect div.dropdown-list ul > li:nth-child(1) > label'
  );
  await ceuthCheckbox.waitFor({ state: 'visible', timeout: 10000 });
  await ceuthCheckbox.click(); // or use .check() if it's <input>

  // ✅ Take screenshot immediately after checking
  await page.waitForTimeout(1000);
  await expect(ceuthCheckbox).toHaveScreenshot('sr-budget-glance-ceuth-checkbox.png');

  // Step 6: Click Apply
  const applyBtn = page.locator(
    'div.refiner-header.ng-tns-c237-4 lift-button:nth-child(2) > button'
  );
  await applyBtn.waitFor({ state: 'visible', timeout: 10000 });
  await applyBtn.click();

  // Optional: Wait for filter tag confirmation
  const filterTag = page.locator('.filter-tag, .chip, .tag-pill').first();
  await filterTag.waitFor({ state: 'visible', timeout: 15000 });

  // Final screenshot of applied state
  await page.waitForTimeout(1500);
  await expect(page).toHaveScreenshot('sr-budget-glance-filter-applied.png');
});
