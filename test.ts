const viewmore = page.locator('dashboard-app-burndate >> div.ng-trigger-collapse >> div:nth-child(2) > div');

// Scroll into view
await viewmore.scrollIntoViewIfNeeded();

// Freeze page scroll
await page.evaluate(() => {
  document.body.style.overflow = 'hidden';
});

// Wait for layout to settle
await page.waitForTimeout(1000);

// Click after stable scroll
await viewmore.click();

// Unfreeze scroll
await page.evaluate(() => {
  document.body.style.overflow = 'auto';
});
