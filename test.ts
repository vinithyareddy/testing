test('Verify Dropdown Option Can Be Selected and Applied', async ({ page }) => {
  test.setTimeout(120000); // reduce timeout to avoid crashing

  // Step 1: Navigate
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000); // conservative wait for dashboard

  // Step 2: Open Filter panel if collapsed
  const filterButton = page.locator('lift-tag div > div > label > div');
  if (await filterButton.isVisible()) {
    await filterButton.click();
    await page.waitForTimeout(3000);
  }

  // Step 3: Expand Fund Center dropdown
  const dropdownHeader = page.getByRole('heading', { name: 'Fund Center' });
  await dropdownHeader.click();
  await page.waitForTimeout(2000);

  // Step 4: Click "Select Fund Center" input to show checkboxes
  const selectDropdown = page.locator('angular2-multiselect div.selected-list');
  await selectDropdown.click();
  await page.waitForTimeout(2000);

  // Step 5: Select the first checkbox (e.g., CEUTH)
  const firstCheckbox = page.locator('app-budget-glance-filters-panel input[type="checkbox"]').first();
  await firstCheckbox.waitFor({ state: 'visible', timeout: 10000 });
  await firstCheckbox.check();

  // Step 6: Screenshot after selection
  await expect(firstCheckbox).toHaveScreenshot('sr-budget-glance-checkbox-checked.png');

  // Step 7: Click Apply
  const applyButton = page.getByRole('button', { name: 'Apply' });
  await applyButton.click();

  // Step 8: Confirm chip/tag appears
  const filterTag = page.locator('.filter-tag, .chip, .tag-pill').first();
  await filterTag.waitFor({ state: 'visible', timeout: 10000 });

  // Step 9: Final screenshot
  await expect(page).toHaveScreenshot('sr-budget-glance-filter-action.png');
});
