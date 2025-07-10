test('Verify BB Outcome by VPU Title is Visible', async ({ page }) => {
  const widget = page.locator('app-outcome-by-vpu');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  // Simpler and stable way to get title
  const title = widget.getByText('BB Outcome by VPU', { exact: true });
  await expect(title).toBeVisible({ timeout: 10000 });

  await expect(title).toHaveScreenshot('sr-budget-glance-bb-outcome-by-vpu-title-visible.png');
});
