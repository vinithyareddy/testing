test('Verify View More Click Works', async ({ page }) => {
  const widget = page.locator('app-final-plans-fundgroup');
  const viewMore = widget.locator('text=View More');

  // Ensure widget loads
  await expect(widget).toBeVisible({ timeout: 10000 });
  await expect(viewMore).toBeVisible({ timeout: 10000 });

  // Smoothly scroll into view to avoid glitching
  await viewMore.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Let layout stabilize

  // Click safely
  await viewMore.click();

  // Verify next page or modal (adjust as needed)
  await page.waitForTimeout(1000); // Optional: wait after click
  await page.screenshot({ path: 'sr-fp-vs-actual-fundgroup-viewmore.png' });
});
