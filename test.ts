test('Verify WPBPG Title is Visible', async ({ page }) => {
  const title = page.getByRole('heading', { name: 'Work Program By Business Process Group', exact: false });
  await expect(title).toBeVisible({ timeout: 20000 });
  await expect(title).toHaveScreenshot('sr-wpbpg-title.png');
});

test('Verify WPBPG Fullscreen Icon is Clickable', async ({ page }) => {
  const fullscreenIcon = page.locator('app-workbybpg i.fa-expand'); // Adjust selector if needed
  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });
  await fullscreenIcon.click();
  await page.waitForTimeout(1000);
  await expect(fullscreenIcon).toHaveScreenshot('sr-wpbpg-fullscreen.png');
});

test('Verify WPBPG Expand Icon is Clickable', async ({ page }) => {
  const expandIcon = page.locator('app-workbybpg img[alt="expand"]'); // Change if needed
  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible();
  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-wpbpg-expanded.png');

  await expandIcon.click();
  await page.waitForTimeout(500);
  await expect(expandIcon).toHaveScreenshot('sr-wpbpg-collapsed.png');
});

test('Verify WPBPG Table is Visible', async ({ page }) => {
  const table = page.locator('app-workbybpg table');
  await expect(table).toBeVisible({ timeout: 15000 });
  await expect(table).toHaveScreenshot('sr-wpbpg-table.png');
});

test('Verify WPBPG Budget Type Toggles Work', async ({ page }) => {
  const toggleAll = page.getByLabel('All');
  const toggleBB = page.getByLabel('BB');
  const toggleReimb = page.getByLabel('REIMB');
  const toggleTF = page.getByLabel('TF');

  await toggleAll.check();
  await page.waitForTimeout(500);
  await expect(page.locator('app-workbybpg table')).toHaveScreenshot('sr-wpbpg-toggle-all.png');

  await toggleBB.check();
  await page.waitForTimeout(500);
  await expect(page.locator('app-workbybpg table')).toHaveScreenshot('sr-wpbpg-toggle-bb.png');

  await toggleReimb.check();
  await page.waitForTimeout(500);
  await expect(page.locator('app-workbybpg table')).toHaveScreenshot('sr-wpbpg-toggle-reimb.png');

  await toggleTF.check();
  await page.waitForTimeout(500);
  await expect(page.locator('app-workbybpg table')).toHaveScreenshot('sr-wpbpg-toggle-tf.png');
});
