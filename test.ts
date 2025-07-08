const fullscreenToggle = page.locator('li img[alt*="fullscreen"], li img[title*="Fullscreen"], li img[src*="fullscreen"]');
await expect(fullscreenToggle).toBeAttached({ timeout: 5000 });
await fullscreenToggle.click();
await page.waitForTimeout(300);
await fullscreenToggle.click(); // Exit fullscreen

// 5. Validate last table row (e.g. "Private Capital Mobilization")
const tableRow = page.locator('.ag-row-last');
await expect(tableRow).toBeVisible({ timeout: 5000 });
});