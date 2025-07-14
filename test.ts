
test.describe('Budget at a Glance – Toggle Button Check', () => {

  test('Toggle to $K and take screenshot', async ({ page }) => {
    await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...'); // Add full URL

    const toggle = page.locator('input[type="checkbox"]'); // Adjust if it's not an input
    await expect(toggle).toBeVisible({ timeout: 30000 });

    // Toggle to $K
    await toggle.click();
    await page.waitForTimeout(2000); // Allow value labels to update

    // Screenshot of $K state
    await page.screenshot({ path: 'toggle-to-K-view.png', fullPage: true });
  });

  test('Toggle back to $M and take screenshot', async ({ page }) => {
    await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?...'); // Add full URL

    const toggle = page.locator('input[type="checkbox"]'); // Adjust if needed
    await expect(toggle).toBeVisible({ timeout: 30000 });

    // Toggle to $K first (if default is $M)
    await toggle.click();
    await page.waitForTimeout(1000);

    // Toggle back to $M
    await toggle.click();
    await page.waitForTimeout(2000);

    // Screenshot of $M state
    await page.screenshot({ path: 'toggle-to-M-view.png', fullPage: true });
  });

});
