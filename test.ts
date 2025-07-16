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
