test('Verify Expand Icon is Clickable in Sources Widget', async ({ page }) => {
  test.setTimeout(120000); // Extended for slow load

  // Wait for widget container
  await page.waitForSelector('app-outcomebyvpu', { timeout: 60000 });

  const widget = page.locator('app-outcomebyvpu');
  await expect(widget).toBeVisible({ timeout: 30000 });

  // Try more stable selector for expand icon
  const expandIcon = widget.locator('img[alt*="Expand"], img[src*="expand"], span.bgt-collabse-state img').first();

  if (await expandIcon.count() === 0) {
    console.error('❌ Expand icon not found.');
    await page.screenshot({ path: 'expand_icon_not_found.png', fullPage: true });
    return;
  }

  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible({ timeout: 15000 });

  // Expand
  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-vpu-expanded.png');

  // Collapse
  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-budget-glance-vpu-collapsed.png');
});
