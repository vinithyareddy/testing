test('Verify Final Plans vs Actuals Title is Visible', async ({ page }) => {
  const title = page.locator('#Dashboard app-final-plans-fundgroup .widget-heading.pointer');
  await expect(title).toBeVisible({ timeout: 10000 });
  await expect(title).toHaveScreenshot('sr-fp-vs-actual-fundgroup-title-visible.png');
});

test('Verify Menu Tab Click Works', async ({ page }) => {
  const menuTab = page.locator('#mat-button-toggle-84-button > span');
  await expect(menuTab).toBeVisible({ timeout: 10000 });
  await menuTab.click();
  await expect(menuTab).toHaveScreenshot('sr-fp-vs-actual-fundgroup-menu-tab.png');
});

test('Verify Table Tab Click Works', async ({ page }) => {
  const tableTab = page.locator('#mat-button-toggle-85-button');
  await expect(tableTab).toBeVisible({ timeout: 10000 });
  await tableTab.click();
  await expect(tableTab).toHaveScreenshot('sr-fp-vs-actual-fundgroup-table-tab.png');
});

test('Verify Fullscreen Icon Clickable', async ({ page }) => {
  const fullscreenIcon = page.locator('#Dashboard app-final-plans-fundgroup .col-md-3.bgt-text-end i');
  await expect(fullscreenIcon).toBeVisible({ timeout: 10000 });
  await fullscreenIcon.click();
  await expect(fullscreenIcon).toHaveScreenshot('sr-fp-vs-actual-fundgroup-fullscreen.png');
});

test('Verify Expand Icon Click', async ({ page }) => {
  const expandIcon = page.locator('#Dashboard app-final-plans-fundgroup .col-md-3.bgt-text-end > span:nth-child(3) > span');
  await expect(expandIcon).toBeVisible({ timeout: 10000 });
  await expandIcon.click();
  await expect(expandIcon).toHaveScreenshot('sr-fp-vs-actual-fundgroup-expand-icon.png');
});

test('Verify Bar Graph is Visible in Menu Tab', async ({ page }) => {
  const graph = page.locator('#Dashboard app-final-plans-fundgroup .ng-trigger-collapse');
  await expect(graph).toBeVisible({ timeout: 10000 });
  await expect(graph).toHaveScreenshot('sr-fp-vs-actual-fundgroup-graph-visible.png');
});

test('Verify Table is Visible in Table Tab', async ({ page }) => {
  const table = page.locator('#Dashboard app-final-plans-fundgroup .ng-trigger-collapse');
  await expect(table).toBeVisible({ timeout: 10000 });
  await expect(table).toHaveScreenshot('sr-fp-vs-actual-fundgroup-table-visible.png');
});

test('Verify View More Option Works', async ({ page }) => {
  const viewMore = page.locator('#Dashboard app-final-plans-fundgroup .ng-trigger-collapse > div:nth-child(2) > div');
  await expect(viewMore).toBeVisible({ timeout: 10000 });
  await viewMore.click();
  await expect(viewMore).toHaveScreenshot('sr-fp-vs-actual-fundgroup-view-more.png');
});
