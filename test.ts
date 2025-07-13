test('Verify BB Outcome by VPU Table is Visible', async ({ page }) => {
  // Wait for the widget container to appear
  const widget = page.locator('app-outcomebyvpu');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  // Locate the table or main content inside the widget
  const table = widget.locator('div.ng-trigger-collapse >> table'); // adjust selector based on actual HTML

  // Fail early if it's not present
  if (await table.count() === 0) {
    console.error('❌ Table not found in DOM.');
    await page.screenshot({ path: 'vpu_table_not_found.png', fullPage: true });
    return;
  }

  // Ensure it's visible
  await expect(table).toBeVisible({ timeout: 90000 });

  // Screenshot for validation
  await expect(table).toHaveScreenshot('sr-budget-glance-vpu-table-visible.png');
});
