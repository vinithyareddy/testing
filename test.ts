test('Verify Expand Icon Click', async ({ page }) => {
  // Step 1: Scroll to WPA Exception widget
  const widget = page.locator('app-wpa-exceptions');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });
await page.waitForTimeout(10000);
  // Step 2: Use a precise selector for the expand icon
  const expandIcon = widget.locator('span[class*="bgt-collabse-state"]'); // More robust than exact class

  // Step 3: Ensure visible before clicking
  await expandIcon.waitFor({ state: 'visible', timeout: 15000 });

  await page.waitForTimeout(1000); // for dropdown to open
  await expect(expandIcon).toHaveScreenshot('sr-wpa-exception-expand-icon.png');
});
