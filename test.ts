test('Verify widget Toggle button', async ({ page }) => {
  const widget = page.locator('app-time-in-error');
  await widget.waitFor({ state: 'visible', timeout: 10000 });

  const toggleAll = page.locator('[aria-label="All"] .mat-radio-outer-circle');
  const toggleBB = page.locator('[aria-label="BB"] .mat-radio-outer-circle');
  const toggleReimb = page.locator('[aria-label="REIMB"] .mat-radio-outer-circle');
  const toggleTF = page.locator('[aria-label="TF"] .mat-radio-outer-circle');

  await toggleAll.waitFor({ state: 'visible', timeout: 10000 });
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
