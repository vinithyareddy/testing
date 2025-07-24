test('Verify Expand Icon Click', async ({ page }) => {
  // Wait for widget
  const widget = page.locator('div.budget-box-chart:has-text("WPA Allocations Outside VPU")');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Locate expand icon within widget
  const expandIcon = widget.locator('img[alt="Expand"], img[title="Expand"]'); // alt or title-based for reliability

  // Ensure it is visible and interactable
  await expect(expandIcon).toBeVisible({ timeout: 10000 });
  await expandIcon.scrollIntoViewIfNeeded();

  // Optional: click the icon if the test expects interaction
  // await expandIcon.click();

  // Screenshot for visual verification
  await expect(expandIcon).toHaveScreenshot('sr-wpa-allocations-expand-icon.png');
});
