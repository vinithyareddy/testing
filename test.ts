test('Verify Projected BB Outcome by VPU Title is Visible', async ({ page }) => {
  // Step 1: Wait until widget block loads
  const widget = page.locator('app-outcomebypvu');
  await widget.waitFor({ state: 'visible', timeout: 15000 });

  // Step 2: Match heading inside the widget (robust, based on screenshot layout)
  const title = widget.locator('div.widget-heading').getByText('BB Outcome by VPU', { exact: true });
  await expect(title).toBeVisible({ timeout: 10000 });

  // Step 3: Screenshot for verification
  await expect(title).toHaveScreenshot('sr-budget-glance-bb-outcome-by-vpu-title.png');
});
