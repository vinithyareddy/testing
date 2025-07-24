test('Verify Expand Icon Click - WPA Allocations Outside VPU widget', async ({ page }) => {
  // Wait for the widget container to appear (not the Shadow DOM element itself)
  const widgetContainer = page.locator('app-wpa-allocations');
  await expect(widgetContainer).toBeAttached({ timeout: 10000 });

  // Scroll the actual card inside the widget, not the tag itself (it is invisible directly)
  const visibleCard = page.locator('div.budget-box-chart.ng-tns-c351066303-240'); // <- update ID if dynamic
  await visibleCard.scrollIntoViewIfNeeded();
  await expect(visibleCard).toBeVisible({ timeout: 10000 });

  // Locate the expand arrow inside header
  const expandIcon = page.locator('span.bgt-collabse-state.pl-2.ng-tns-c351066303-240.ng-star-inserted img');
  await expect(expandIcon).toBeVisible({ timeout: 10000 });

  // Click the icon
  await expandIcon.click();

  // Screenshot after click
  await expect(expandIcon).toHaveScreenshot('sr-fp-vs-actual-wpa-allocations-expand-icon.png');
});
