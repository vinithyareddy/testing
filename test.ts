test('Verify Filters → Clear button resets selections', async ({ page }) => {
  // Open Filters Panel
  const filterBtn = page.getByRole('button', { name: 'Filter' });
  await filterBtn.click();

  // Select a checkbox (e.g., Include Subordinate)
  const subordinateCheckbox = page.getByLabel('Include Subordinate');
  await subordinateCheckbox.check();

  // Click Clear
  const clearBtn = page.getByRole('button', { name: 'CLEAR' });
  await clearBtn.click();

  // Assert checkbox is now unchecked
  await expect(subordinateCheckbox).not.toBeChecked();
});

test('Verify Filters → Apply button applies changes', async ({ page }) => {
  // Open Filters
  await page.getByRole('button', { name: 'Filter' }).click();

  // Tick 'Include Subordinate'
  const subordinateCheckbox = page.getByLabel('Include Subordinate');
  await subordinateCheckbox.check();

  // Click Apply
  await page.getByRole('button', { name: 'APPLY' }).click();

  // Assert some UI change happens — e.g., filter chip appears
  await expect(page.getByText('Include Subordinate')).toBeVisible();
});

test('Verify Filters → Dropdown expands and selects option', async ({ page }) => {
  await page.getByRole('button', { name: 'Filter' }).click();

  // Open dropdown (e.g., Posting Period)
  const dropdown = page.getByRole('button', { name: 'Posting Period' }); // adjust if different
  await dropdown.click();

  // Select a value (e.g., 'Sep')
  const option = page.getByLabel('Sep'); // or getByText('Sep') if label fails
  await option.check(); // or click if checkbox isn't used

  await expect(option).toBeChecked();
});
