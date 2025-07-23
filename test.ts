test('Verify Expand Icon in Widget', async ({ page }) => {
  // Select the correct instance of app-time-in-error (overview tab)
  const widget = page.locator('app-time-in-error').nth(1);

  // Scope down to the expand icon inside the widget
  const expandIcon = widget.locator('.bgt-text-end span:nth-child(4) img');

  // Optional: give time for widget animations/load
  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  await expect(expandIcon).toHaveScreenshot('sr-trs-overview-time-in-error-expand-icon.png');
});
