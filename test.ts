test('Verify Table Icon, Data Widget, and Table Data Visibility', async ({ page }) => {
    await page.waitForTimeout(3000);
  
    // Locate widget first
    const widget = page.locator('GeneralExp > div > div > div:nth-child(1) > div > app-exception-summary > div.qa-exp-card-box');
    await widget.waitFor({ state: 'visible', timeout: 120000 });
  
    // Use robust selector based on aria-pressed + type attributes or ID
    const tableIcon = page.locator('button.mat-button-toggle-button[aria-pressed="true"]');
  
    // Wait for icon to be attached and visible
    await tableIcon.waitFor({ state: 'visible', timeout: 12000 });
    await expect(tableIcon).toBeVisible();
  
    // Optional screenshot before click
    await expect(tableIcon).toHaveScreenshot('qa-dashboard-3yr-trend-widget-table-icon-visible.png');
  
    // Click the icon
    await tableIcon.click();
    await page.waitForTimeout(3000);
  
    // Wait for data widget to be visible
    const dataWidget = page.locator('data-widget-selector'); // Replace with actual selector
    await dataWidget.waitFor({ state: 'visible', timeout: 10000 });
    await expect(dataWidget).toBeVisible();
    await expect(dataWidget).toHaveScreenshot('qa-dashboard-3yr-trend-table-tab-data-widget-visible.png');
  });
  