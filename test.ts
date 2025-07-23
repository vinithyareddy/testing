test('Verify Drag Row Group Bar', async ({ page }) => {
  // Correct: locate the right "Time in Error" widget
  const widget = page.locator('app-time-in-error').nth(1);
  await expect(widget).toBeVisible();

  // Scope View More inside that widget
  const viewMoreButton = widget.locator('text=View More');

  await viewMoreButton.scrollIntoViewIfNeeded();
  await expect(viewMoreButton).toBeVisible({ timeout: 5000 });
  await viewMoreButton.click();

  // Wait for report to load (may need extra wait if slow)
  await page.waitForSelector('app-rm-ag-report', { timeout: 15000 });

  // Now look for the drag row bar
  const dragRowBar = page.locator('app-rm-ag-report .ag-column-drop-wrapper > div').first();

  await expect(dragRowBar).toBeVisible({ timeout: 10000 });
  await expect(dragRowBar).toHaveScreenshot('sr-trs-overview-time-in-error-drag-row-bar.png');
});
