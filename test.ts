test('Verify Missing Time Widget Title', async ({ page }) => {
  const title = page.locator('#Dashboard app-missing-time .widget-heading');
  await expect(title).toBeVisible();
  await expect(title).toHaveScreenshot('missing-time-title.png');
});


test('Verify Filter Dropdown', async ({ page }) => {
  const dropdown = page.locator('#Dashboard app-missing-time ng-select');
  await expect(dropdown).toBeVisible();
  await expect(dropdown).toHaveScreenshot('missing-time-filter-dropdown.png');
});

test('Verify Graph Tab Button (Menu Tab)', async ({ page }) => {
  const menuTab = page.locator('#mat-button-toggle-25-button');
  await expect(menuTab).toBeVisible();
  await expect(menuTab).toHaveScreenshot('missing-time-menu-tab.png');
});

test('Verify Table Tab Button', async ({ page }) => {
  const tableTab = page.locator('#mat-button-toggle-26-button');
  await expect(tableTab).toBeVisible();
  await expect(tableTab).toHaveScreenshot('missing-time-table-tab.png');
});

test('Verify Fullscreen Option in Widget', async ({ page }) => {
  const fullScreen = page.locator('#Dashboard app-missing-time .view i');
  await expect(fullScreen).toBeVisible();
  await expect(fullScreen).toHaveScreenshot('missing-time-fullscreen-icon.png');
});

test('Verify Expand Icon in Widget', async ({ page }) => {
  const expand = page.locator('#Dashboard app-missing-time .bgt-text-end span:nth-child(3)');
  await expect(expand).toBeVisible();
  await expect(expand).toHaveScreenshot('missing-time-expand-icon.png');
});

test('Verify Graph in Menu Tab', async ({ page }) => {
  await page.locator('#mat-button-toggle-25-button').click(); // ensure graph view is active
  const graph = page.locator('#Dashboard app-missing-time .ng-trigger-collapse');
  await expect(graph).toBeVisible();
  await expect(graph).toHaveScreenshot('missing-time-graph-view.png');
});

test('Verify Table View is Visible', async ({ page }) => {
  await page.locator('#mat-button-toggle-26-button').click(); // switch to table tab
  const table = page.locator('#Dashboard app-missing-time .ng-trigger-collapse');
  await expect(table).toBeVisible();
  await expect(table).toHaveScreenshot('missing-time-table-view.png');
});

test('Verify View More Option Clickable', async ({ page }) => {
  const viewMore = page.locator('#Dashboard app-missing-time .ng-trigger-collapse div:nth-child(2) > div');
  await expect(viewMore).toBeVisible();
  await viewMore.click();
  await expect(viewMore).toHaveScreenshot('missing-time-view-more-clicked.png');
});

test('Verify Search Option After Expand', async ({ page }) => {
  const search = page.locator('#filter-text-box');
  await expect(search).toBeVisible();
  await expect(search).toHaveScreenshot('missing-time-search.png');
});

test('Verify Wrap Text Checkbox', async ({ page }) => {
  const wrapCheckbox = page.locator('body app-rm-ag-report ul > li:nth-child(3) > input');
  await expect(wrapCheckbox).toBeVisible();
  await expect(wrapCheckbox).toHaveScreenshot('missing-time-wrap-text.png');
});

test('Verify Export to Excel Button', async ({ page }) => {
  const exportBtn = page.locator('body app-rm-ag-report ul > li:nth-child(2)');
  await expect(exportBtn).toBeVisible();
  await expect(exportBtn).toHaveScreenshot('missing-time-export-excel.png');
});

test('Verify Fullscreen Icon After Expand', async ({ page }) => {
  const fullIcon = page.locator('body app-rm-ag-report ul > li:nth-child(1) > img');
  await expect(fullIcon).toBeVisible();
  await expect(fullIcon).toHaveScreenshot('missing-time-expanded-fullscreen.png');
});

test('Verify Columns Tab', async ({ page }) => {
  const columns = page.locator('body app-rm-ag-report .ag-side-buttons > div:nth-child(1) > button');
  await expect(columns).toBeVisible();
  await expect(columns).toHaveScreenshot('missing-time-columns-tab.png');
});

test('Verify Filters Tab', async ({ page }) => {
  const filters = page.locator('body app-rm-ag-report .ag-side-buttons > div:nth-child(2)');
  await expect(filters).toBeVisible();
  await expect(filters).toHaveScreenshot('missing-time-filters-tab.png');
});

test('Verify Drag Row Group Bar', async ({ page }) => {
  const dragRowBar = page.locator('body app-rm-ag-report .ag-column-drop-wrapper > div:nth-child(1)');
  await expect(dragRowBar).toBeVisible();
  await expect(dragRowBar).toHaveScreenshot('missing-time-drag-row-bar.png');
});

test('Verify Data Table', async ({ page }) => {
  const table = page.locator('body app-rm-ag-report .ag-root');
  await expect(table).toBeVisible();
  await expect(table).toHaveScreenshot('missing-time-data-table.png');
});

test('Verify First Row Dropdown Expand', async ({ page }) => {
  const dropdownIcon = page.locator('body app-rm-ag-report .ag-group-contracted');
  await expect(dropdownIcon).toBeVisible();
  await expect(dropdownIcon).toHaveScreenshot('missing-time-first-row-dropdown.png');
});
