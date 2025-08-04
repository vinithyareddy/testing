const regionCheckbox = page.locator('label:has-text("Eastern and Southern Africa") >> input[type="checkbox"]');
await regionCheckbox.waitFor({ state: 'visible', timeout: 10000 });
await regionCheckbox.click();

await page.waitForTimeout(1000);