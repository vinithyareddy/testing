test('Verify Fullscreen Icon is Clickable in Sources Widget', async ({ page }) => {
  const widget = page.locator('#Dashboard app-source-users');
  await expect(widget).toBeVisible({ timeout: 10000 });

  const fullscreenIcon = page.locator('span.view').nth(1);
  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });

  await fullscreenIcon.click();
  await page.waitForTimeout(3000);

  await expect(page).toHaveScreenshot('sr-sources-uses-widget-fullscreen.png');
});
