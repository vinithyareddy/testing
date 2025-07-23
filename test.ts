test('Verify widget Toggle button', async ({ page }) => {
  const widget = page.locator('app-time-in-error');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Use role and name for radio buttons instead of unstable IDs
  const toggleAll = page.getByRole('radio', { name: /^ALL$/ });
  const toggleBB = page.getByRole('radio', { name: /^BB$/ });
  const toggleREIMB = page.getByRole('radio', { name: /^REIMB$/ });
  const toggleTF = page.getByRole('radio', { name: /^TF$/ });

  // Click and verify ALL toggle
  await expect(toggleAll).toBeVisible({ timeout: 10000 });
  await toggleAll.click({ force: true });

  await page.waitForTimeout(1000); // Let UI settle
  await expect(widget).toHaveScreenshot('sr-trs-overview-time-in-error-toggle-all.png');

  // Optionally test other toggles (optional but good for coverage)
  await toggleBB.click({ force: true });
  await toggleREIMB.click({ force: true });
  await toggleTF.click({ force: true });
});
