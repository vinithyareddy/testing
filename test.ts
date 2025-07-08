// 5. Fullscreen toggle (for IBRD+IDA metrics page)
const fullscreenToggle = page.locator('li:has(img[alt="fullscreen"])');
await expect(fullscreenToggle).toBeVisible({ timeout: 5000 });

await fullscreenToggle.click();
await page.waitForTimeout(500); // Optional visual confirmation

await fullscreenToggle.click(); // Exit fullscreen
