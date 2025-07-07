test('Verify As Of Date Dropdown is Present', async ({ page }) => {
  const dateDropdown = page.locator('text=As of Date');
  await expect(dateDropdown).toBeAttached();
  await expect(dateDropdown).toBeVisible();
  await expect(dateDropdown).toHaveScreenshot('oh-ibrd-ida-as-of-date-dropdown.png');
});
