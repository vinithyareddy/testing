for (const month of months) {
  const monthTag = page.getByText(month).nth(0); // Use .first() or scoped locator if needed
  await expect(monthTag).toBeVisible({ timeout: 10000 });
}

// Take a full filter tag screenshot
await expect(page.locator('div')).toHaveScreenshot('sr-budget-glance-default-filter-tags.png');
});