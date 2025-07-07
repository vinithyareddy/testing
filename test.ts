test('Verify Indicator Approval Status is 0 and 36', async ({ page }) => {
  const section = page.locator('.zapprovalstatus-section');

  // Step 1: Wait for section to be visible
  await expect(section).toBeVisible({ timeout: 10000 });

  // Step 2: Get the spans containing values
  const spans = section.locator('span');

  // Step 3: Validate specific positions or contents
  const zero = spans.nth(1);       // 0 is the second span
  const thirtySix = spans.nth(3);  // 36 is the fourth span

  // Step 4: Visibility and Screenshot Checks
  await expect(zero).toBeVisible({ timeout: 10000 });
  await expect(thirtySix).toBeVisible({ timeout: 10000 });

  await expect(zero).toHaveScreenshot('oh-ibrd-ida-indicator-0.png');
  await expect(thirtySix).toHaveScreenshot('oh-ibrd-ida-indicator-36.png');
});
