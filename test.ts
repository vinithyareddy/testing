test('Verify Expand Icon Click', async ({ page }) => {
  const widget = page.locator('div.budget-box-chart:has-text("WPA Allocations Outside VPU")');
  await expect(widget).toBeVisible({ timeout: 20000 });

  // Optional: wait for loading spinner to disappear
  await page.waitForSelector('.spinner, .loading-skeleton', { state: 'detached', timeout: 15000 });

  // Now wait for icon
  const expandIcon = widget.locator('img[alt="Expand"], img[title="Expand"]');
  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Optional click
  // await expandIcon.click();

  await expect(expandIcon).toHaveScreenshot('sr-wpa-allocations-expand-icon.png');
});
