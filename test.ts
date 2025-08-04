test('Verify Table Icon', async ({ page }) => {
    await page.waitForTimeout(3000);
      const widget = page.locator('app-top-exceptions'); 
      const tableIcon = widget.locator('button.mat-button-toggle').nth(0); 
    await tableIcon.waitFor({ state: 'visible', timeout: 12000 });
    await expect(tableIcon).toBeVisible();
    await tableIcon.click();
    await page.waitForTimeout(3000);
    await expect(tableIcon).toHaveScreenshot('qa-dashboard-top-exceptions-widget-table-icon-visible.png');
  });
  