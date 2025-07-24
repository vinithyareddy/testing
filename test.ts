test('verify view more - wraptext option', async ({ page }) => {
  // Ensure page is fully loaded before interacting
  await page.waitForLoadState('domcontentloaded');

  // Locate the widget safely
  const widget = page.locator('app-plans-by-business-process');
  await expect(widget).toBeVisible({ timeout: 15000 });

  // Scroll it into view if needed
  try {
      await widget.scrollIntoViewIfNeeded();
  } catch (err) {
      console.warn('Could not scroll widget into view. Retrying after timeout...');
      await page.waitForTimeout(3000);
      await widget.scrollIntoViewIfNeeded();
  }

  // Click "View More"
  const viewMore = page.locator('app-plans-by-business-process >> text=View More');
  await expect(viewMore).toBeVisible({ timeout: 10000 });
  await viewMore.scrollIntoViewIfNeeded();
  await viewMore.click();

  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(4000);  // Give UI time to render filter bar

  // Locate and click "Wrap Text" checkbox
  const wrapTextCheckbox = page.locator('input[type="checkbox"]:right-of(:text("Wrap Text"))');
  await expect(wrapTextCheckbox).toBeVisible({ timeout: 10000 });
  await wrapTextCheckbox.click();

  // Screenshot
  await expect(wrapTextCheckbox).toHaveScreenshot('sr-fp-vs-actual-businessprocess-view-more-wrapcheckbox-option.png');
});
