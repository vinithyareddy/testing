
test('Verify Indicator Approval Status Values Are 0 and 36', async ({ page }) => {
  const approvalLabel = page.locator('text=Indicator Approval Status');
  await expect(approvalLabel).toBeVisible();
  const approvalValues = page.locator('div:has-text("0") >> div:has-text("36")');
  await expect(approvalValues.first()).toBeVisible();
  await expect(approvalValues).toHaveScreenshot('oh-ibrd-ida-approval-status-values.png');
});

test('Verify Tooltip Icon is Present', async ({ page }) => {
  const tooltip = page.locator('i.fas.fa-info-circle');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveScreenshot('oh-ibrd-ida-tooltip-icon.png');
});

test('Verify As Of Date Dropdown is Present', async ({ page }) => {
  const dateDropdown = page.locator('div:has-text("As of Date")');
  await dateDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await expect(dateDropdown).toBeVisible();
  await expect(dateDropdown).toHaveScreenshot('oh-ibrd-ida-as-of-date-dropdown.png');
});

test('Verify Card and Classic Tabs Are Present', async ({ page }) => {
  const cardTab = page.getByRole('tab', { name: /Card/i });
  const classicTab = page.getByRole('tab', { name: /Classic/i });
  await expect(cardTab).toBeVisible();
  await expect(classicTab).toBeVisible();
  await expect(cardTab).toHaveScreenshot('oh-ibrd-ida-tab-card.png');
  await expect(classicTab).toHaveScreenshot('oh-ibrd-ida-tab-classic.png');
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
