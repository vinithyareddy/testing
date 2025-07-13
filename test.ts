test('Verify BB Outcome by VPU Title is Visible', async ({ page }) => {
  // Wait for widget container
  await page.waitForSelector('app-outcomebyvpu', { timeout: 15000 });

  // Try flexible, text-based locator
  const title = page.getByText('Sources and Uses', { exact: false });

  // Wait until it's visible
  await expect(title).toBeVisible({ timeout: 10000 });

  // Screenshot validation
  await expect(title).toHaveScreenshot('sr-budget-glance-vpu-title.png');
});
