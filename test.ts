const tableIcon = page.locator('mat-icon.mat-icon[aria-label="table_view"]');
await tableIcon.waitFor({ state: 'visible', timeout: 10000 });
await tableIcon.click();
