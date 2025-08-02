await widget.scrollIntoViewIfNeeded();

const tableIcon = widget.locator('button.mat-button-toggle span.mat-button-toggle-label-content');

await tableIcon.waitFor({ state: 'visible', timeout: 12000 });
await expect(tableIcon).toHaveScreenshot('qa-dashboard-other-management-attention-widget-table-icon-visible.png');

await tableIcon.click();
await page.waitForTimeout(3000);
await expect(widget).toHaveScreenshot('qa-dashboard-other-management-attention-widget-table-tab-data.png');
