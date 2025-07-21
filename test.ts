
  // Click on "Filters" tab
  const filterTab = page.locator('text=Filter');
  await filterTab.click();
  await page.waitForTimeout(1000);

  // Expand "Source of Funds" accordion section using its label text
  const sourceOfFundsToggle = page.locator('text=Source of Funds');
  await expect(sourceOfFundsToggle).toBeVisible({ timeout: 10000 });
  await sourceOfFundsToggle.click();

  // Wait for checkboxes to appear (e.g., TF, BB, etc.)
  const tfCheckbox = page.locator('label:has-text("TF") input[type="checkbox"]');
  await expect(tfCheckbox).toBeVisible({ timeout: 10000 });

  // Click the TF checkbox
  await tfCheckbox.check(); // or `.click()` if check doesn't work

  await page.waitForTimeout(1000); // let the UI register

  // Take screenshot after checkbox selection
  const filterPanel = page.locator('.refremi-sticky-refremi-sidebar'); // Adjust class if needed
  await expect(filterPanel).toHaveScreenshot('sr-wpa-filter-panel-fund-center-option-check.png', {
    timeout: 10000,
    animations: 'disabled',
  });

  // Click on "Apply" button
  const applyBtn = page.locator('button:has-text("Apply")');
  await applyBtn.click();

  await page.waitForTimeout(3000); // Wait for filter to apply

