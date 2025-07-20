

  // ========== Uses by Fund Group (YTD) ==========
  test('1. Verify title: Uses by Fund Group (YTD)', async ({ page }) => {
    const block = page.locator(widget);
    await block.scrollIntoViewIfNeeded();
    const title = block.locator('div:nth-child(2) div.col-md-6.pr-0 div.widget-heading');
    await expect(title).toBeVisible();
    await expect(title).toHaveScreenshot('uses-fundgroup-title.png');
  });

  test('2. Click Uses tab and verify', async ({ page }) => {
    const usesTab = page.locator('#mat-button-toggle-2');
    await usesTab.scrollIntoViewIfNeeded();
    await usesTab.click();
    await expect(usesTab).toHaveScreenshot('uses-tab-selected.png');
  });

  test('3. Click Sources tab and verify', async ({ page }) => {
    const sourcesTab = page.locator('#mat-button-toggle-3');
    await sourcesTab.scrollIntoViewIfNeeded();
    await sourcesTab.click();
    await expect(sourcesTab).toHaveScreenshot('sources-tab-selected.png');
  });

  test('4. Verify Uses graph visible', async ({ page }) => {
    await page.locator('#mat-button-toggle-2').click();
    const usesGraph = page.locator('#highcharts-91nbeyi-441 > svg > rect.highcharts-background');
    await expect(usesGraph).toBeVisible();
    await expect(usesGraph).toHaveScreenshot('uses-graph.png');
  });

  test('5. Verify Sources graph visible', async ({ page }) => {
    await page.locator('#mat-button-toggle-3').click();
    const sourcesGraph = page.locator(widget + ' div:nth-child(2) div.col-md-6.pr-0 div:nth-child(2)');
    await expect(sourcesGraph).toBeVisible();
    await expect(sourcesGraph).toHaveScreenshot('sources-graph.png');
  });

  test('6. Verify Uses graph in M and K currency toggle', async ({ page }) => {
    await page.locator('#mat-button-toggle-2').click();
    const toggle = page.locator(toggleSwitch);
    await toggle.click(); // M to K
    await expect(page.locator('#highcharts-91nbeyi-441')).toHaveScreenshot('uses-graph-k-currency.png');
    await toggle.click(); // K back to M
    await expect(page.locator('#highcharts-91nbeyi-441')).toHaveScreenshot('uses-graph-m-currency.png');
  });

  test('7. Verify Sources graph in M and K currency toggle', async ({ page }) => {
    await page.locator('#mat-button-toggle-3').click();
    const toggle = page.locator(toggleSwitch);
    await toggle.click(); // M to K
    await expect(widget + ' div:nth-child(2) div.col-md-6.pr-0 div:nth-child(2)').toHaveScreenshot('sources-graph-k-currency.png');
    await toggle.click(); // K back to M
    await expect(widget + ' div:nth-child(2) div.col-md-6.pr-0 div:nth-child(2)').toHaveScreenshot('sources-graph-m-currency.png');
  });

  // ========== Fixed Vs Variable ==========
  test('1. Verify title: Fixed Vs Variable', async ({ page }) => {
    const fvvTitle = page.locator(widget + ' div:nth-child(2) div.col-md-6.pl-0 div.widget-heading');
    await fvvTitle.scrollIntoViewIfNeeded();
    await expect(fvvTitle).toBeVisible();
    await expect(fvvTitle).toHaveScreenshot('fixed-vs-variable-title.png');
  });

  test('2. Click F&V tab and verify', async ({ page }) => {
    const fvvTab = page.locator('button:has-text("F&V")');
    await fvvTab.click();
    await expect(fvvTab).toHaveScreenshot('fv-tab-selected.png');
  });

  test('3. Click S&U tab and verify', async ({ page }) => {
    const suTab = page.locator('button:has-text("S&U")');
    await suTab.click();
    await expect(suTab).toHaveScreenshot('su-tab-selected.png');
  });

  test('4. Verify F&V graph visible', async ({ page }) => {
    const fvvGraph = page.locator('div.chart-fv');
    await expect(fvvGraph).toBeVisible();
    await expect(fvvGraph).toHaveScreenshot('fv-graph.png');
  });

  test('5. Verify S&U graph visible', async ({ page }) => {
    const suGraph = page.locator('div.chart-su');
    await expect(suGraph).toBeVisible();
    await expect(suGraph).toHaveScreenshot('su-graph.png');
  });

  test('6. F&V graph toggle M and K currency', async ({ page }) => {
    const toggle = page.locator(toggleSwitch);
    await toggle.click();
    await expect(page.locator('div.chart-fv')).toHaveScreenshot('fv-graph-k.png');
    await toggle.click();
    await expect(page.locator('div.chart-fv')).toHaveScreenshot('fv-graph-m.png');
  });

  test('7. S&U graph toggle M and K currency', async ({ page }) => {
    const toggle = page.locator(toggleSwitch);
    await toggle.click();
    await expect(page.locator('div.chart-su')).toHaveScreenshot('su-graph-k.png');
    await toggle.click();
    await expect(page.locator('div.chart-su')).toHaveScreenshot('su-graph-m.png');
  });
});
