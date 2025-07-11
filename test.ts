test.describe('budget at glance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance', {
      waitUntil: 'domcontentloaded',
      timeout: 60000, // increase for safety
    });

    // Optional: Disable animations if things flash
    await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; }' });

    // Confirm the main title is there (guarantees app loaded)
    await expect(page.getByText('Budget at a Glance', { exact: true })).toBeVisible({ timeout: 10000 });

    // Ensure the main widget container is there
    await expect(page.locator('app-home-source-uses')).toBeVisible({ timeout: 15000 });

    // Wait a bit more for API/data to render (adjust as needed)
    await page.waitForTimeout(2000);
  });

  test('Verify View More button is visible and clickable', async ({ page }) => {
    const viewMore = page.getByRole('button', { name: 'View More' });

    await viewMore.scrollIntoViewIfNeeded();
    await expect(viewMore).toBeVisible({ timeout: 10000 });
    await viewMore.click();

    // Optional: wait for rows to expand or widget to change
    await page.waitForTimeout(1000);
  });

  test('Verify BB Outcome title is visible', async ({ page }) => {
    const title = page.getByText('BB Outcome by VPU', { exact: true });
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  // Add your other tests here similarly...
});
