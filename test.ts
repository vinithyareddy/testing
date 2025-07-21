test('Verify Fullscreen Icon Clickable', async ({ page }) => {
  // Wait for widget to load
  const widget = page.locator('app-final-plans-fundgroup');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Relaxed selector using role or i tag inside .view span
  const fullscreenIcon = widget.locator('span.view i');

  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });
  await fullscreenIcon.click();
  await expect(fullscreenIcon).toHaveScreenshot('sr-fp-vs-actual-fundgroup-fullscreen.png');
});
