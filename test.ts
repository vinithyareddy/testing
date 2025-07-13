test('Verify Filters → Clear button resets selections and takes snapshot', async ({ page }) => {
  await page.getByRole('button', { name: 'Filter' }).click();

  const checkbox = page.getByLabel('Include Subordinate');
  await checkbox.check();

  await page.getByRole('button', { name: 'CLEAR' }).click();

  await expect(checkbox).not.toBeChecked();

  const filterPanel = page.locator('.filters-panel'); // Adjust selector to your filters container
  await expect(filterPanel).toHaveScreenshot('filters-clear-button-reset.png', { timeout: 10000 });
});
test('Verify Filters → Apply button applies changes and takes snapshot', async ({ page }) => {
  await page.getByRole('button', { name: 'Filter' }).click();

  const checkbox = page.getByLabel('Include Subordinate');
  await checkbox.check();

  await page.getByRole('button', { name: 'APPLY' }).click();

  const summaryBar = page.locator('.applied-filters-bar'); // Adjust selector to section showing applied filters
  await expect(summaryBar).toHaveScreenshot('filters-apply-button-applied.png', { timeout: 10000 });
});
test('Verify Filters → Include Subordinate checkbox toggles and takes snapshot', async ({ page }) => {
  await page.getByRole('button', { name: 'Filter' }).click();

  const checkbox = page.getByLabel('Include Subordinate');
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  const filterPanel = page.locator('.filters-panel'); // snapshot after checking
  await expect(filterPanel).toHaveScreenshot('filters-checkbox-checked.png', { timeout: 10000 });

  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();

  await expect(filterPanel).toHaveScreenshot('filters-checkbox-unchecked.png', { timeout: 10000 });
});
test('Verify Filters → Dropdown interaction with selection and snapshot', async ({ page }) => {
  await page.getByRole('button', { name: 'Filter' }).click();

  const dropdown = page.getByRole('button', { name: 'Posting Period' }); // Adjust if needed
  await dropdown.click();

  const option = page.getByLabel('Sep'); // Or getByText('Sep')
  await option.check();

  const filterPanel = page.locator('.filters-panel'); // snapshot after selecting dropdown value
  await expect(filterPanel).toHaveScreenshot('filters-dropdown-posting-period-sep-selected.png', { timeout: 10000 });
});
