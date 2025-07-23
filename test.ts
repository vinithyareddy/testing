test('Verify Wrap Text Checkbox', async ({ page }) => {
  // Step 1: Locate and click "View More" in Time Not Entered section
  const viewMoreButton = page.locator('app-missing-time .viewmore.pointer');
  await expect(viewMoreButton).toBeVisible({ timeout: 10000 });
  await viewMoreButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); // Let animation stabilize
  await viewMoreButton.click();

  // Step 2: Wait for navigation to "Missing Time Report"
  await page.waitForURL('**/trs-staff-cost/reports/trs001', { timeout: 15000 });

  // Step 3: Locate "Wrap Text" checkbox
  const wrapCheckbox = page.locator('input.form-check-input[type="checkbox"]');

  await expect(wrapCheckbox).toBeVisible({ timeout: 10000 });

  // Step 4: Take screenshot
  await expect(wrapCheckbox).toHaveScreenshot('sr-trs-overview-missing-time-wrap-text.png');
});
