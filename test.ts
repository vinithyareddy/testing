test('Verify BB Outcome by VPU Title is Visible', async ({ page }) => {
  // Wait for the page to fully load using a visible KPI title
  await page.getByText('PROJECTED BB OUTCOME', { exact: false }).waitFor({ timeout: 15000 });

  // Now wait for BB Outcome widget to appear
  const widget = page.locator('app-outcome-by-vpu:visible');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Get the title inside the widget
  const title = widget.getByText('BB Outcome by VPU', { exact: true });
  await expect(title).toBeVisible({ timeout: 10000 });

  // Screenshot for validation
  await expect(title).toHaveScreenshot('sr-budget-glance-bb-outcome-by-vpu-title-visible.png');
});
