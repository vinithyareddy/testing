test('verify view more - drag row bar option', async ({ page }) => {
  const widget = page.locator('app-temp-code');
  await widget.scrollIntoViewIfNeeded();
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Use .first() to guard against missing node list
  const viewMore = page.locator('#Dashboard app-temp-code .ng-trigger-collapse > div:nth-child(2) > div').first();

  // Wait for View More button to actually appear in DOM
  await expect(viewMore).toHaveCount(1, { timeout: 15000 }); // NEW: ensure element exists
  await viewMore.scrollIntoViewIfNeeded();
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  await viewMore.click();

  // Wait for next page widget (drag bar) to appear
  const dragRowBar = page.locator('div.ag-column-drop-wrapper > div:nth-child(1)');
  await expect(dragRowBar).toBeVisible({ timeout: 15000 });

  await expect(dragRowBar).toHaveScreenshot('sr-wpa-temp-code-view-more-dragrowbar-option.png');
});
