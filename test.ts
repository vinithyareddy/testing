
test('Verify User Icon is Visible', async ({ page }) => {
  const icon = page.locator('img[alt="User profile picture"]');
  await expect(icon).toBeVisible();
  await expect(icon).toHaveScreenshot('user-icon-visible.png');
});

test('Verify Help Button is Visible', async ({ page }) => {
  const help = page.getByRole('button', { name: /help/i });
  await expect(help).toBeVisible();
  await expect(help).toHaveScreenshot('help-button-visible.png');
});

test('Verify Bell Icon is Visible', async ({ page }) => {
  const bell = page.getByRole('button', { name: /notifications/i });
  await expect(bell).toBeVisible();
  await expect(bell).toHaveScreenshot('bell-icon-visible.png');
});

test('Verify Download Button is Present', async ({ page }) => {
  const dlBtn = page.getByRole('button', { name: 'Download' });
  await expect(dlBtn).toBeVisible();
  await expect(dlBtn).toHaveScreenshot('download-button.png');
});

// -------------------------
// 2. BREADCRUMB + TITLE
// -------------------------
test('Verify Breadcrumb Navigation', async ({ page }) => {
  const breadcrumb = page.locator('app-top-header');
  await expect(breadcrumb).toBeVisible();
  await expect(breadcrumb).toHaveScreenshot('breadcrumb-navigation.png');
});

test('Verify Page Title - IBRD+IDA', async ({ page }) => {
  const heading = page.getByRole('heading', { name: 'IBRD+IDA' });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveScreenshot('page-title-ibrd-ida.png');
});

// ----------------------------------
// 3. SIDEBAR NAVIGATION CHECKS
// ----------------------------------
const navItems = [
  'WBG Overview',
  'IBRD+IDA',
  'IBRD',
  'IDA',
  'IFC',
  'MIGA',
  'Thematic Highlights',
  'Finance & Risk highlights',
  'Internal Resources',
  'Guarantee Platform'
];

for (const item of navItems) {
  test(`Verify Sidebar Navigation Link: ${item}`, async ({ page }) => {
    const navLink = page.getByRole('link', { name: new RegExp(item, 'i') });
    await expect(navLink).toBeVisible();
    await expect(navLink).toHaveScreenshot(`sidebar-link-${item.replace(/\s+/g, '-')}.png`);
  });
}
