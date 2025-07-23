test('Verify Wrap Text Checkbox', async ({ page }) => {
  // Step 1: Locate and click "View More" in Missing Time widget
  const viewMoreButton = page.locator('app-missing-time >> text=View More');

  await expect(viewMoreButton).toBeVisible({ timeout: 10000 });
  await viewMoreButton.scrollIntoViewIfNeeded();
  await viewMoreButton.click();

  // Step 2: Locate "Wrap Text" checkbox (3rd checkbox in the list)
  const wrapCheckbox = page.locator('input.form-check-input[type="checkbox"]').nth(2);

  await expect(wrapCheckbox).toBeVisible({ timeout: 10000 });

  // Step 3: Take screenshot
  await expect(wrapCheckbox).toHaveScreenshot('sr-trs-overview-missing-time-wrap-text.png');
});
