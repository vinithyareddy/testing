// 5. Fullscreen toggle
const fullscreenToggle = page.locator('img[title="Zoom"]');
await expect(fullscreenToggle).toBeVisible({ timeout: 5000 });

await fullscreenToggle.click(); // Enter fullscreen
await page.waitForTimeout(300);
await fullscreenToggle.click(); // Exit fullscreen
