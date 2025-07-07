
  // -------- INDICATOR STATUS AND TABS --------
  test('Verify Indicator Approval Status is 0 and 36', async ({ page }) => {
    const zero = page.locator('span:has-text("0")');
    const thirtySix = page.locator('span:has-text("36")');
    await expect(zero).toBeVisible();
    await expect(thirtySix).toBeVisible();
    await expect(zero).toHaveScreenshot('indicator-0.png');
    await expect(thirtySix).toHaveScreenshot('indicator-36.png');
  });

  test('Verify As Of Date Dropdown is Present', async ({ page }) => {
    const dateDropdown = page.locator('input[type="date"], input[placeholder*="date"]');
    await expect(dateDropdown).toBeVisible();
    await expect(dateDropdown).toHaveScreenshot('as-of-date-dropdown.png');
  });

  test('Verify Card and Classic Tabs Are Present', async ({ page }) => {
    const cardTab = page.getByRole('tab', { name: /Card/i });
    const classicTab = page.getByRole('tab', { name: /Classic/i });
    await expect(cardTab).toBeVisible();
    await expect(classicTab).toBeVisible();
    await expect(cardTab).toHaveScreenshot('tab-card.png');
    await expect(classicTab).toHaveScreenshot('tab-classic.png');
  });

  // -------- DROPDOWN OPTIONS --------
  const dropdownOptions = ['All Indicators', 'Primary Metrics', 'Other Metrics of Interest'];
  for (const option of dropdownOptions) {
    test(`Verify Dropdown Option: ${option}`, async ({ page }) => {
      const dropdown = page.locator('mat-select[formcontrolname="metricFilter"]');
      await dropdown.click();
      const optionItem = page.getByRole('option', { name: option });
      await expect(optionItem).toBeVisible();
      await expect(optionItem).toHaveScreenshot(`dropdown-option-${option.replace(/\s+/g, '-')}.png`);
      await optionItem.click();
    });
  }