// 1. Verify Widget Title is Visible
test('Verify Sources and Uses Widget Title is Visible', async ({ page }) => {
  const title = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div > div > div > div.widget-heading.mt-1.cursor > span');
  await expect(title).toBeVisible();
  await expect(title).toHaveScreenshot('sr-sources-uses-widget-title.png');
});

// 2. Verify Search Option Inside Widget is Visible
test('Verify Search Option in Sources and Uses Widget', async ({ page }) => {
  const searchInput = page.locator('#filter-text-box');
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toHaveScreenshot('sr-sources-uses-widget-search.png');
});

// 3. Verify Export Excel Option
test('Verify Export Excel Option in Sources and Uses Widget', async ({ page }) => {
  const exportBtn = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div > div > app-budget-ag-report > div > div > div > div > div.col-lg-5.text-right > div > div > ul > li:nth-child(2)');
  await expect(exportBtn).toBeVisible();
  await expect(exportBtn).toHaveScreenshot('sr-sources-uses-export-excel.png');
});

// 4. Verify Fullscreen Option
test('Verify Fullscreen Button in Sources and Uses Widget', async ({ page }) => {
  const fullscreenIcon = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div > div > app-budget-ag-report > div > div > div > div > div.col-lg-5.text-right > div > div > ul > li:nth-child(1) > img');
  await expect(fullscreenIcon).toBeVisible();
  await expect(fullscreenIcon).toHaveScreenshot('sr-sources-uses-fullscreen-button.png');
});

// 5. Verify Table is Visible
test('Verify Sources and Uses Table is Visible', async ({ page }) => {
  const table = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div > div > app-budget-ag-report > div > div > div > ag-grid-angular > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal');
  await expect(table).toBeVisible({ timeout: 15000 });
  await expect(table).toHaveScreenshot('sr-sources-uses-table-visible.png');
});

// 6. Verify Drag Here to Set Row Groups Bar is Visible
test('Verify Row Group Drag Bar is Visible', async ({ page }) => {
  const dragBar = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div > div > app-budget-ag-report > div > div > div > ag-grid-angular > div > div.ag-column-drop-wrapper > div:nth-child(1)');
  await expect(dragBar).toBeVisible();
  await expect(dragBar).toHaveScreenshot('sr-sources-uses-drag-row-group-bar.png');
});

// 7. Verify Columns Tab Beside Table
test('Verify Columns Tab Functionality in Sources and Uses Widget', async ({ page }) => {
  const columnTab = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div > div > app-budget-ag-report > div > div > div > ag-grid-angular > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-side-bar.ag-unselectable.ag-side-bar-right.ag-focus-managed > div.ag-side-buttons > div:nth-child(1) > button');
  await columnTab.click();
  await expect(columnTab).toBeVisible();
  await expect(columnTab).toHaveScreenshot('sr-sources-uses-columns-tab.png');
});

// 8. Verify Filters Tab + Search and Dropdown
test('Verify Filters Tab Search and Dropdown in Sources and Uses Widget', async ({ page }) => {
  const filtersTab = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div > div > app-budget-ag-report > div > div > div > ag-grid-angular > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-side-bar.ag-unselectable.ag-side-bar-right.ag-focus-managed > div.ag-side-buttons > div:nth-child(2) > button');
  await filtersTab.click();

  const searchInput = page.locator('#ag-50-input');
  const dropdownToggle = page.locator('#Dashboard > div > div > div:nth-child(2) > div > app-sources-breakdown > div > div > div > app-budget-ag-report > div > div > div > ag-grid-angular > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-side-bar.ag-unselectable.ag-side-bar-right.ag-focus-managed > div:nth-child(3) > div.ag-filter-toolpanel > div.ag-filter-toolpanel-search > div.ag-filter-toolpanel-expand > span.ag-icon.ag-icon-tree-open');

  await expect(searchInput).toBeVisible();
  await expect(dropdownToggle).toBeVisible();

  await expect(searchInput).toHaveScreenshot('sr-sources-uses-filter-search.png');
  await expect(dropdownToggle).toHaveScreenshot('sr-sources-uses-filter-dropdown.png');
});
