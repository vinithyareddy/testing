test('Verify Menu Tab Click Works', async ({ page }) => {
  const widget = page.locator('app-final-plans-fundgroup');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Look for toggle button with icon (assumes menu view has a bar chart icon)
  const menuTab = widget.locator('mat-button-toggle-group button').first(); // or `.nth(0)`
  
  await expect(menuTab).toBeVisible({ timeout: 10000 });
  await menuTab.click();

  await expect(menuTab).toHaveScreenshot('sr-fp-vs-actual-fundgroup-menu-tab.png');
});
