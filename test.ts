await viewmore.scrollIntoViewIfNeeded();
await expect(viewmore).toBeVisible({ timeout: 5000 });
await viewmore.click();
await page.waitForLoadState('networkidle'); // Or a locator wait