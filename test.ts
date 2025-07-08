// 5. Fullscreen toggle
const fullscreenToggle = page.locator('li[title="Full Screen Toggle"]');

// fallback: if still fails, use another common pattern
await expect(fullscreenToggle).toBeVisible({ timeout: 5000 });

await fullscreenToggle.click();
await page.waitForTimeout(300);
await fullscreenToggle.click(); // Exit fullscreen
