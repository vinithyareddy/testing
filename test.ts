test('Verify Expand Icon Click', async ({ page }) => {
  const widget = page.locator('app-wpa-exceptions');

  // Scroll and wait for widget to load
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Now find expand icon based on its stable parent structure
  const expandIcon = widget.locator('span.bpdt-collapse-state');  // Shortened robust selector
  await expect(expandIcon).toBeVisible({ timeout: 15000 });

  await expandIcon.click();
  await expect(expandIcon).toHaveScreenshot('sr-wpa-exception-expand-icon.png');
});
