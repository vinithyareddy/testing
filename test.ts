test('Verify Fullscreen Icon', async ({ page }) => {
  // Step 1: Locate and click "View More"
  const viewMoreButton = page.locator('app-missing-time >> text=View More');

  await expect(viewMoreButton).toBeVisible({ timeout: 10000 });
  await viewMoreButton.scrollIntoViewIfNeeded();
  await viewMoreButton.click();

  // Step 2: Locate fullscreen icon (based on title attribute)
  const fullscreenIcon = page.locator('img[title="fullscreen"]');

  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });

  // Step 3: Screenshot
  await expect(fullscreenIcon).toHaveScreenshot('sr-trs-overview-missing-time-expanded-fullscreen.png');
});
