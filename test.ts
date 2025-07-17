test('Expand Sources and Uses row and take screenshot', async ({ page }) => {
  // Step 1: Go to the page
  await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgi%251~N%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22%5D');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000); // let dashboard finish rendering

  // Step 2: Wait for the Sources and Uses widget to load
  const widget = page.locator('app-home-source-uses');
  await expect(widget).toBeVisible({ timeout: 10000 });

  // Step 3: Click the plus icon in the second row
  const plusIcon = widget.locator('table tbody tr:nth-child(2) td.pointer i');
  await plusIcon.waitFor({ state: 'visible', timeout: 5000 });
  await plusIcon.click();

  // Step 4: Wait for the expanded row (third row) to appear
  const expandedRow = widget.locator('table tbody tr:nth-child(3)');
  await expect(expandedRow).toBeVisible({ timeout: 5000 });

  // Step 5: Take screenshot of the expanded widget/table
  await widget.screenshot({ path: 'sr-budget-glance-expanded-row.png' });
});
