test('Validate World Bank Group text is visible', async ({ page }) => {
  const footerText = page.locator('footer >> text=World Bank Group');
  await expect(footerText).toBeVisible();
  await footerText.screenshot({ path: 'footer-world-bank-group.png' });
});

test('Click World Bank link and take screenshot', async ({ page }) => {
  const link = page.getByRole('link', { name: 'World Bank' });
  await link.click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'footer-link-world-bank.png' });
});

test('Click IFC link and take screenshot', async ({ page }) => {
  const link = page.getByRole('link', { name: 'IFC' });
  await link.click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'footer-link-ifc.png' });
});

test('Click MIGA link and take screenshot', async ({ page }) => {
  const link = page.getByRole('link', { name: 'MIGA' });
  await link.click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'footer-link-miga.png' });
});

test('Click ICSID link and take screenshot', async ({ page }) => {
  const link = page.getByRole('link', { name: 'ICSID' });
  await link.click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'footer-link-icsid.png' });
});

test('Validate Emergency Contact text is visible', async ({ page }) => {
  const contactText = page.locator('footer >> text=Emergency Contact Number (US) (202) 458-8888');
  await expect(contactText).toBeVisible();
  await contactText.screenshot({ path: 'footer-emergency-contact.png' });
});

test('Validate © 2025 World Bank Group text is visible', async ({ page }) => {
  const copyright =
    page.locator('footer >> text=© 2025 The World Bank Group. All Rights Reserved');
  await expect(copyright).toBeVisible();
  await copyright.screenshot({ path: 'footer-copyright.png' });
});
