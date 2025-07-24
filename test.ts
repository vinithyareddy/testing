test('Verify widget Toggle button', async ({ page }) => {
  const widget = page.locator('app-plans-by-bussiness-process');
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  const toggleAll = page.locator('#mat-radio-22-input');
  const toggleBB = page.locator('#mat-radio-23-input');
  const toggleReimb = page.locator('#mat-radio-24-input');
  const toggleTF = page.locator('#mat-radio-25-input');

  await toggleAll.waitFor({ state: 'visible', timeout: 10000 });
  await toggleAll.check({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-fp-vs-actual-businessprocess-toggle-all.png');

  await toggleBB.waitFor({ state: 'visible', timeout: 10000 });
  await toggleBB.check({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-fp-vs-actual-businessprocess-toggle-bb.png');

  await toggleReimb.waitFor({ state: 'visible', timeout: 10000 });
  await toggleReimb.check({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-fp-vs-actual-businessprocess-toggle-reimb.png');

  await toggleTF.waitFor({ state: 'visible', timeout: 10000 });
  await toggleTF.check({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-fp-vs-actual-businessprocess-toggle-tf.png');
});
