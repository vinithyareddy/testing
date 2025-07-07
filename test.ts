

test('Verify Tooltip Icon is Present', async ({ page }) => {
  const tooltip = page.locator('i.fas.fa-info-circle');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveScreenshot('oh-ibrd-ida-tooltip-icon.png');
});

// ----------------------------
// ALL INDICATORS DROPDOWN OPTIONS
// ----------------------------

test('Verify All Indicators Dropdown - All Indicators Option', async ({ page }) => {
  const dropdown = page.getByRole('button', { name: /All Indicators/i });
  await dropdown.click();
  const allIndicatorsOption = page.getByRole('option', { name: /All Indicators/i });
  await expect(allIndicatorsOption).toBeVisible();
  await expect(allIndicatorsOption).toHaveScreenshot('oh-ibrd-ida-dropdown-all-indicators.png');
});

test('Verify All Indicators Dropdown - Primary Metrics Option', async ({ page }) => {
  const dropdown = page.getByRole('button', { name: /All Indicators/i });
  await dropdown.click();
  const primaryOption = page.getByRole('option', { name: /Primary Metrics/i });
  await expect(primaryOption).toBeVisible();
  await expect(primaryOption).toHaveScreenshot('oh-ibrd-ida-dropdown-primary-metrics.png');
});

test('Verify All Indicators Dropdown - Other Metrics of Interest Option', async ({ page }) => {
  const dropdown = page.getByRole('button', { name: /All Indicators/i });
  await dropdown.click();
  const otherOption = page.getByRole('option', { name: /Other Metrics of Interest/i });
  await expect(otherOption).toBeVisible();
  await expect(otherOption).toHaveScreenshot('oh-ibrd-ida-dropdown-other-metrics.png');
});
});
