const title = page.locator('app-final-plans-fundgroup h3:has-text("Final Plans vs Actuals by Fund Group")');

await title.scrollIntoViewIfNeeded();
await expect(title).toBeVisible({ timeout: 15000 }); // Increased timeout
await expect(title).toHaveScreenshot('sr-wpa-fp-vs-actual-fundgroup-title-visible.png');
