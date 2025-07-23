test('Verify Wrap Text Checkbox in Missing Time Report', async ({ page }) => {
  test.setTimeout(120000); // Extend timeout

  // Wait for the Missing Time widget to appear
  const missingTimeWidget = page.locator('app-missing-time');
  await expect(missingTimeWidget).toBeVisible({ timeout: 15000 });

  // Locate 'View More' button (use text instead of brittle nth-child)
  const viewMore = missingTimeWidget.getByRole('link', { name: /view more/i });

  // Scroll and click
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible();
  await viewMore.click();

  // Wait for navigation to report view
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Allow extra for rendering

  // Locate Wrap Text checkbox
  const wrapCheckbox = page.locator('text=Wrap Text').locator('input[type="checkbox"]');
  await expect(wrapCheckbox).toBeVisible({ timeout: 10000 });

  // Screenshot of checkbox
  await expect(wrapCheckbox).toHaveScreenshot('sr-trs-overview-missing-time-wrap-text.png');
});
