test('Verify Expand Icon Click', async ({ page }) => {
  // Wait for the whole widget region
  const widget = page.locator('app-temp-code');

  // Ensure the widget is attached to the DOM before interaction
  await expect(widget).toHaveCount(1, { timeout: 10000 });

  // Scroll the widget into view (safe fallback in case it's below viewport)
  await widget.scrollIntoViewIfNeeded();

  // Optional wait for rendering after scroll
  await page.waitForTimeout(500);

  // Use reliable selector for the expand arrow
  const expandIcon = page.locator('app-temp-code span.bgt-collabse-state img');

  // Wait until the expand icon becomes visible
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Click the expand icon
  await expandIcon.click();

  // Wait for potential expansion animation (optional)
  await page.waitForTimeout(1000);

  // Capture screenshot
  await expect(expandIcon).toHaveScreenshot('sr-wpa-temp-code-expand-icon.png');
});
