const fullscreenIcon = page.locator('span.view >> img');
await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });

await fullscreenIcon.click();
await page.waitForTimeout(3000);
await expect(page).toHaveScreenshot('sr-sources-uses-widget-fullscreen.png');
