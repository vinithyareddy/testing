test('Verify WPBPG Title is Visible', async ({ page }) => {
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  const title = widget.getByRole('heading', { name: /Work Program/i }); // Looser match
  await expect(title).toBeVisible({ timeout: 20000 });

  await expect(title).toHaveScreenshot('sr-budget-glance-wpbpg-title.png');
});

test('Verify WPBPG Fullscreen Icon is Clickable', async ({ page }) => {
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  const fullscreenIcon = widget.locator('i.bx-fullscreen'); // Use a class-based or role-based locator
  await expect(fullscreenIcon).toBeVisible({ timeout: 20000 });

  await fullscreenIcon.click();
  await page.waitForTimeout(1000);
  await expect(fullscreenIcon).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen.png');
});

test('Verify WPBPG Expand Icon is Clickable', async ({ page }) => {
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  const expandIcon = widget.locator('img[alt="Expand/Collapse"]'); // Adjust if `alt` exists or use sibling class
  await expandIcon.scrollIntoViewIfNeeded();
  await expect(expandIcon).toBeVisible();

  await expandIcon.click(); await page.waitForTimeout(500);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-expanded.png');

  await expandIcon.click(); await page.waitForTimeout(500);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-collapsed.png');
});

test('Verify WPBPG Table is Visible', async ({ page }) => {
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  const table = widget.locator('table');
  await expect(table).toBeVisible({ timeout: 20000 });

  await expect(table).toHaveScreenshot('sr-budget-glance-wpbpg-table.png');
});

test('Verify WPBPG Budget Type Toggles Work', async ({ page }) => {
  const widget = page.locator('app-work-program-by-business-process');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  const toggleAll = page.getByRole('radio', { name: /All/i });
  const toggleBB = page.getByRole('radio', { name: /BB/i });
  const toggleReimb = page.getByRole('radio', { name: /REIMB/i });
  const toggleTF = page.getByRole('radio', { name: /TF/i });

  await toggleAll.check(); await page.waitForTimeout(500);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-all.png');

  await toggleBB.check(); await page.waitForTimeout(500);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-bb.png');

  await toggleReimb.check(); await page.waitForTimeout(500);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-reimb.png');

  await toggleTF.check(); await page.waitForTimeout(500);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-tf.png');
});
