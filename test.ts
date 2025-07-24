test('Verify Table is Visible', async ({ page }) => {
  const widgetWrapper = page.locator('app-wpa-allocations');
  await expect(widgetWrapper).toBeVisible({ timeout: 15000 });

  const tableContainer = widgetWrapper.locator('div.TableView');

  // Scroll and wait for possible animation after expand
  await tableContainer.scrollIntoViewIfNeeded();
  await expect(tableContainer).toBeVisible({ timeout: 10000 });

  const table = tableContainer.locator('table');
  await expect(table).toBeVisible({ timeout: 10000 });

  await expect(table).toHaveScreenshot('sr-fp-vs-actual-wpa-allocations-table-visible.png');
});
