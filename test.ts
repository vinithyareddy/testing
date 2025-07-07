test('Verify Indicator Approval Status is 0 and 36', async ({ page }) => {
  // First verify the parent section is visible
  const section = page.locator('.zapprovalstatus-section');
  await expect(section).toBeVisible({ timeout: 10000 });

  // Now try to find the numbers within it
  const zero = section.getByText('0', { exact: true });
  const thirtySix = section.getByText('36', { exact: true });

  await expect(zero).toBeVisible({ timeout: 10000 });
  await expect(thirtySix).toBeVisible({ timeout: 10000 });

  await expect(zero).toHaveScreenshot('oh-ibrd-ida-indicator-0.png');
  await expect(thirtySix).toHaveScreenshot('oh-ibrd-ida-indicator-36.png');
});
