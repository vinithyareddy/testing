test('Verify Expand Plus Icon inside Sources Table', async ({ page }) => {
  const widget = page.locator('app-home-source-uses');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Try to get any plus icon inside the widget
  const plusIcon = widget.locator('i.fa-plus, span.fa-plus'); // covers both <i> and <span> cases

  // If icon appears only on hover, scroll/hover first
  await plusIcon.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300); // allow any hover-based rendering

  await expect(plusIcon.first()).toBeVisible({ timeout: 5000 });

  // Click + capture screenshot
  await plusIcon.first().click();
  await expect(plusIcon.first()).toHaveScreenshot('sr-budget-glance-sources-plus-expanded.png');
});
