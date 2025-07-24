test('Verify View More - WrapText Option', async ({ page }) => {
  // Wait for the dashboard to load fully
  await page.waitForSelector('text=WPA Expenditure Summary', { timeout: 20000 });

  // Select the WPA widget by its content or unique section
  const widget = page.locator('app-wpa-allocations:has-text("WPA Allocations Outside VPU")');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Scroll widget into view safely
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Click 'View More' inside the widget
  const viewMore = widget.locator('text=View More');
  await expect(viewMore).toBeVisible({ timeout: 5000 });
  await viewMore.click();

  // Wait for route transition to next page
  await page.waitForLoadState('networkidle');

  // Confirm you landed on the WrapText section using a known header
  await expect(page.locator('text=WPA allocations outside the VPU')).toBeVisible({ timeout: 10000 });

  // Find and click on Wrap Text checkbox
  const wraptextCheckbox = page.locator('text=Wrap Text').locator('xpath=..').locator('input[type="checkbox"]');
  await expect(wraptextCheckbox).toBeVisible({ timeout: 5000 });
  await wraptextCheckbox.click();

  // Wait for visual update
  await page.waitForTimeout(1000);

  // Screenshot the checkbox interaction
  await expect(wraptextCheckbox).toHaveScreenshot('sr-fp-vs-actual-wpa-allocations-view-more-wrapcheckbox-option.png');
});
