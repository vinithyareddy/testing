test('Verify Table Tab Click Works', async ({ page }) => {
  const widget = page.locator('app-final-plans-fundgroup');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Second toggle button — likely the table view
  const tableTab = widget.locator('mat-button-toggle-group button').nth(1);

  await expect(tableTab).toBeVisible({ timeout: 10000 });
  await tableTab.click();

  await expect(tableTab).toHaveScreenshot('sr-fp-vs-actual-fundgroup-table-tab.png');
});
