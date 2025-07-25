const burnRateTitle = page.locator('div.budget-box-h1', { hasText: 'BURN RATE' });
await expect(burnRateTitle).toBeVisible();