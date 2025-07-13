test('Verify BB Outcome by VPU Table is Visible', async ({ page }) => {
  const widget = page.locator('app-outcomebyvpu');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  const table = widget.locator('div.ng-trigger-collapse >> table');

  if (await table.count() === 0) {
    console.warn('⚠️ Table not found immediately — attempting visibility wait.');
    await page.screenshot({ path: 'vpu_table_delayed.png', fullPage: true });
  }

  await expect(table).toBeVisible({ timeout: 90000 });
  await expect(table).toHaveScreenshot('sr-budget-glance-vpu-table-visible.png');
});
