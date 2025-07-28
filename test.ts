test('Verify Table View is Visible', async ({ page }) => {
  const widget = page.locator('app-time-entered');
  await expect(widget).toBeVisible({ timeout: 10000 });
  const tableTab = page.locator('mat-button-toggle-group button').nth(1);
  await expect(tableTab).toBeVisible({ timeout: 10000 });
  await tableTab.click();
  const table = page.locator('#Dashboard app-time-entered .ng-trigger-collapse');
  await expect(table).toBeVisible({ timeout: 15000 });
  const rows = table.locator('table tbody tr');
  await expect(rows.first()).toBeVisible({ timeout: 10000 });
  await table.scrollIntoViewIfNeeded();
  await expect(table).toHaveScreenshot('sr-trs-overview-time-entered-table-view.png');
});
