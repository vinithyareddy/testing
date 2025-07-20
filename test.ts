test('Check title of Fixed Vs Variable', async ({ page }) => {
  const widget = page.locator('app-uses-breakdown');
  await widget.scrollIntoViewIfNeeded();
  const title = page.getByText('Fixed Vs Variable');
  await expect(title).toBeVisible();
  await expect(title).toHaveScreenshot('fv-title.png');
});

test('Click on F&V tab', async ({ page }) => {
  const fvTab = page.getByRole('tab', { name: 'F&V' });
  await fvTab.scrollIntoViewIfNeeded();
  await fvTab.click();
  await expect(fvTab).toHaveScreenshot('fv-tab-clicked.png');
});

test('Click on S&U tab', async ({ page }) => {
  const suTab = page.getByRole('tab', { name: 'S&U' });
  await suTab.scrollIntoViewIfNeeded();
  await suTab.click();
  await expect(suTab).toHaveScreenshot('su-tab-clicked.png');
});

test('Check F&V graph is visible', async ({ page }) => {
  const fvTab = page.getByRole('tab', { name: 'F&V' });
  await fvTab.click();
  const graph = page.locator('div.chart-fv'); // update selector if needed
  await expect(graph).toBeVisible();
  await expect(graph).toHaveScreenshot('fv-graph.png');
});

test('Check S&U graph is visible', async ({ page }) => {
  const suTab = page.getByRole('tab', { name: 'S&U' });
  await suTab.click();
  const graph = page.locator('div.chart-su'); // update selector if needed
  await expect(graph).toBeVisible();
  await expect(graph).toHaveScreenshot('su-graph.png');
});

test('Check F&V graph in M and K currency', async ({ page }) => {
  const toggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > span');
  const fvTab = page.getByRole('tab', { name: 'F&V' });
  await fvTab.click();

  await toggle.click(); // to K
  await expect(fvTab).toHaveScreenshot('fv-k-currency.png');

  await toggle.click(); // to M
  await expect(fvTab).toHaveScreenshot('fv-m-currency.png');
});

test('Check S&U graph in M and K currency', async ({ page }) => {
  const toggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > span');
  const suTab = page.getByRole('tab', { name: 'S&U' });
  await suTab.click();

  await toggle.click(); // to K
  await expect(suTab).toHaveScreenshot('su-k-currency.png');

  await toggle.click(); // to M
  await expect(suTab).toHaveScreenshot('su-m-currency.png');
});
