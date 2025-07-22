test('Verify Expand Icon in Widget', async ({ page }) => {
  const widget = page.locator('app-time-in-error');
  await expect(widget).toBeVisible({ timeout: 10000 });

  const expand = widget.locator('span[class*="bgt-collapse-state"]'); // More specific
  await expect(expand).toBeVisible({ timeout: 10000 });

  await expect(expand).toHaveScreenshot('sr-trs-overview-time-in-error-expand-icon.png');
});
