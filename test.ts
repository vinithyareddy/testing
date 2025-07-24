test('verify view more - wraptext option', async ({ page }) => {
  // Identify the Temp Codes widget
  const widget = page.locator('app-temp-code');

  // Locate the "View More" inside the widget
  const viewMore = widget.locator('text=View More');

  // Wait for widget to appear and scroll into view
  await expect(widget).toBeVisible({ timeout: 10000 });
  await widget.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  // Click View More
  await viewMore.click();

  // Wait for checkbox panel to load — add retries until the checkbox appears
  const wrapCheckbox = page.locator('li:nth-child(3) > input[type="checkbox"]');

  await expect(wrapCheckbox).toBeVisible({ timeout: 10000 });

  // Click the checkbox and verify screenshot
  await wrapCheckbox.click();
  await expect(wrapCheckbox).toHaveScreenshot('sr-wpa-temp-code-view-more-wrapcheckbox-option.png');
});
