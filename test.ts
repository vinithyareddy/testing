const filterTab = page.locator('span.tagviewShow lift-tag label'); // This targets the clickable tab

await filterTab.waitFor({ state: 'visible', timeout: 90000 });
await filterTab.click();

const checkbox = page.getByRole('checkbox', { name: /include subordinate/i });
await checkbox.waitFor({ state: 'visible', timeout: 90000 });

await checkbox.scrollIntoViewIfNeeded();
await checkbox.check();

await page.waitForTimeout(1000);
await expect(checkbox).toHaveScreenshot('sr-budget-glance-filter-checkbox.png');


test('Verify Dropdown Option Expands', async ({ page }) => {
  test.setTimeout(180000); // Extend for full load

  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...'); // your full URL

  const filterTab = page.locator('span.tagviewShow lift-tag label');
  await filterTab.waitFor({ state: 'visible', timeout: 90000 });
  await filterTab.click();

  const dropdown = page.locator('mat-expansion-panel').first();
  await dropdown.waitFor({ state: 'visible', timeout: 60000 });

  await dropdown.click();
  await page.waitForTimeout(3000);

  await expect(dropdown).toHaveScreenshot('sr-budget-glance-filter-dropdown.png');
});


test('Verify Apply Option Works', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...');

  const filterTab = page.locator('span.tagviewShow lift-tag label');
  await filterTab.waitFor({ state: 'visible', timeout: 90000 });
  await filterTab.click();

  const applyBtn = page.getByRole('button', { name: 'Apply' });
  await applyBtn.waitFor({ state: 'visible', timeout: 60000 });

  await applyBtn.scrollIntoViewIfNeeded();
  await applyBtn.click();

  await page.waitForTimeout(4000);
  await expect(applyBtn).toHaveScreenshot('sr-budget-glance-filter-applybtn.png');
});


test('Close Filter Tab', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...');

  const filterTab = page.locator('span.tagviewShow lift-tag label');
  await filterTab.waitFor({ state: 'visible', timeout: 90000 });
  await filterTab.click();

  const closeIcon = page.locator('app-budget-refiner .refiner-header i.fa-times'); // Updated selector
  await closeIcon.waitFor({ state: 'visible', timeout: 60000 });

  await closeIcon.scrollIntoViewIfNeeded();
  await closeIcon.click();

  await page.waitForTimeout(4000);
  await expect(closeIcon).toHaveScreenshot('sr-budget-glance-filter-closeicon.png');
});

test('Verify Dropdown Option Can Be Selected and Applied', async ({ page }) => {
  test.setTimeout(240000); // allow full load time

  // Step 1: Navigate to page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000); // buffer

  // Step 2: Click Filters tab if it's collapsed
  const filterPanel = page.locator('text=Filters');
  if (await filterPanel.isVisible()) {
    await filterPanel.click(); // Only if it's a button/tab
    await page.waitForTimeout(2000);
  }

  // Step 3: Expand "Fund Center" dropdown (or replace with any dropdown label)
  const dropdownLabel = page.locator('text=Fund Center'); // visible label
  await dropdownLabel.click(); // expands dropdown

  // Step 4: Select the first checkbox in the list
  const firstCheckbox = page.locator('app-budget-glance-filters-panel input[type="checkbox"]').first();
  await firstCheckbox.waitFor({ state: 'visible', timeout: 10000 });
  await firstCheckbox.check(); // Playwright handles scrolling
  await page.waitForTimeout(1000); // buffer

  // Step 5: Click Apply
  const applyBtn = page.locator('button', { hasText: 'Apply' });
  await expect(applyBtn).toBeVisible({ timeout: 10000 });
  await applyBtn.click();

  // Step 6: Wait for top filter tag to update (e.g., a chip with selected value)
  const filterTag = page.locator('.filter-tag, .tag-pill, .fnt-toggle').first(); // Adjust selector if needed
  await filterTag.waitFor({ state: 'visible', timeout: 15000 });

  // Step 7: Screenshot the summary bar where filter shows
  await page.waitForTimeout(1500);
  await expect(filterTag).toHaveScreenshot('sr-budget-glance-filter-applied.png');
});



test('Verify Dropdown Option Can Be Selected and Applied', async ({ page }) => {
  test.setTimeout(240000);

  // Step 1: Go to Budget at a Glance page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000); // buffer

  // Step 2: Open Filters panel
  const filterPanel = page.locator('text=Filters');
  await filterPanel.click();
  await page.waitForTimeout(2000);

  // Step 3: Expand dropdown (e.g., Fund Center)
  const dropdownLabel = page.locator('text=Fund Center');
  await dropdownLabel.click();
  await page.waitForTimeout(1000);

  // ✅ Step 4: Locate and check first visible checkbox
  const firstCheckbox = page.locator(
    'app-budget-glance-filters-panel input[type="checkbox"]'
  ).first();
  await firstCheckbox.waitFor({ state: 'visible', timeout: 10000 });
  await firstCheckbox.check(); // Playwright will scroll if needed

  // ✅ Take screenshot immediately after check
  await page.waitForTimeout(1000);
  await expect(firstCheckbox).toHaveScreenshot('sr-budget-glance-checkbox-checked.png');

  // Step 5: Click Apply
  const applyBtn = page.getByRole('button', { name: 'Apply' });
  await expect(applyBtn).toBeVisible({ timeout: 10000 });
  await applyBtn.click();

  // Step 6: Wait for tag to appear showing the filter applied
  const filterTag = page.locator('.filter-tag, .chip, .tag-pill').first();
  await filterTag.waitFor({ state: 'visible', timeout: 15000 });

  // Step 7: Screenshot the state after apply
  await page.waitForTimeout(1500);
  await expect(page).toHaveScreenshot('sr-budget-glance-filter-action.png');
});
