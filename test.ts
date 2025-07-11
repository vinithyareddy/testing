test('Verify Projected BB Outcome by VPU Title is Visible', async ({ page }) => {
  // Wait for the BB Outcome widget area to be in DOM
  const widget = page.locator('app-outcomebypvu');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Now locate the title text inside that widget
  const title = widget.getByText('BB Outcome by VPU', { exact: true });

  // Confirm it becomes visible
  await expect(title).toBeVisible({ timeout: 10000 });

  // Screenshot for verification
  await expect(title).toHaveScreenshot('sr-budget-glance-bb-outcome-by-vpu-title.png');
});
