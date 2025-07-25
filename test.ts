const expandIcon = page.locator('xpath=//div[contains(text(), "Final Plans vs Actuals by Business Process")]/following::img[contains(@src, "arrow_down.png")][1]');

await expect(expandIcon).toBeVisible({ timeout: 10000 });
await expandIcon.click();
await page.waitForTimeout(500); // wait for UI to expand