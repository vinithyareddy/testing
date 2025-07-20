// Scroll to the widget to trigger rendering of all elements
const widget = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown');
await widget.scrollIntoViewIfNeeded();
await expect(widget).toBeVisible({ timeout: 10000 });
