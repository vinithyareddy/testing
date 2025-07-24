test('verify view more - wraptext option', async ({ page }) => {

  // Scroll into the widget
  const widget = page.locator('app-plans-by-business-process');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Click on "View More" inside the widget
  const viewMore = page.locator('app-plans-by-business-process >> text=View More');
  await expect(viewMore).toBeVisible({ timeout: 10000 });
  await viewMore.click();

  // Wait for navigation/load (safe fallback)
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // allow any transitions

  // Locate "Wrap Text" checkbox
  const wrapTextCheckbox = page.locator('input[type="checkbox"]:right-of(:text("Wrap Text"))');
  await expect(wrapTextCheckbox).toBeVisible({ timeout: 10000 });

  // Click and verify
  await wrapTextCheckbox.click();
  await expect(wrapTextCheckbox).toHaveScreenshot('sr-fp-vs-actual-businessprocess-view-more-wrapcheckbox-option.png');
});
