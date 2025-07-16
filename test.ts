test('Verify WPBPG Budget Type Toggles Work', async ({ page }) => {
  // Step 1: Go to the page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22%5D');

  const widget = page.locator('app-work-program-by-business-process');

  // Step 2: Scroll to the widget and wait for it to be visible
  await widget.scrollIntoViewIfNeeded();
  await widget.waitFor({ state: 'visible', timeout: 60000 });

  // Step 3: Define radio toggle buttons using labels
  const toggleAll = page.getByRole('radio', { name: /All/i });
  const toggleBB = page.getByRole('radio', { name: /BB/i });
  const toggleReimb = page.getByRole('radio', { name: /REIMB/i });
  const toggleTF = page.getByRole('radio', { name: /TF/i });

  // Step 4: Interact and take screenshots
  await toggleAll.check({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-all.png');

  await toggleBB.check({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-bb.png');

  await toggleReimb.check({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-reimb.png');

  await toggleTF.check({ force: true });
  await page.waitForTimeout(1000);
  await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-tf.png');
});
