test('verify - Apply Fund Center Filter', async ({ page }) => {
  await page.waitForTimeout(3000);
  const filterTab = page.locator('button:has-text("Apply")'); // any button to anchor location
  await filterTab.waitFor({ state: 'visible', timeout: 10000 });
  const dropdown = page.locator('div.lift-accordion-item:has-text("Regions & Countries")');
  await dropdown.waitFor({ state: 'visible', timeout: 10000 });
  await dropdown.click();
  const checkboxLabel = page.locator('label:has-text("Eastern and Southern Africa")');
  await checkboxLabel.waitFor({ state: 'visible', timeout: 10000 });
  const checkboxInput = page.locator('label:has-text("Eastern and Southern Africa") >> input[type="checkbox"]');
  await checkboxInput.check(); // equivalent to click with proper state handling

  // Optional wait
  await page.waitForTimeout(1000);

  // Screenshot before applying (optional)
  await page.screenshot({ path: 'sr-operation-report-ras-activity-details-filter-apply.png' });

  // Click Apply
  const applyBtn = page.locator('button:has-text("Apply")');
  await applyBtn.waitFor({ state: 'visible', timeout: 10000 });
  await applyBtn.click();
});
