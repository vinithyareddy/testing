test('Verify widget Toggle button', async ({ page }) => {
  // Wait for the text "Time in Error" — proves widget rendered
  await page.getByText('Time in Error', { exact: true }).waitFor({ state: 'visible', timeout: 15000 });

  const widget = page.locator('app-time-in-error');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Stable radio button selectors
  const toggleAll = page.locator('mat-radio-button[aria-label="All"]');
  const toggleBB = page.locator('mat-radio-button[aria-label="BB"]');
  const toggleReimb = page.locator('mat-radio-button[aria-label="REIMB"]');
  const toggleTF = page.locator('mat-radio-button[aria-label="TF"]');

  // Click All
  await expect(toggleAll).toBeVisible({ timeout: 10000 });
  await toggleAll.click({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-trs-overview-time-in-error-toggle-all.png');

  await toggleBB.click({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-trs-overview-time-in-error-toggle-bb.png');

  await toggleReimb.click({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-trs-overview-time-in-error-toggle-reimb.png');

  await toggleTF.click({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-trs-overview-time-in-error-toggle-tf.png');
});
