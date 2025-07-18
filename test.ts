test('Toggle currency in Sources and Uses ($M to $K)', async ({ page }) => {
  await page.goto('https://standardreportsbetaqa.worldbank.org/source-uses?filter=%5B%22bg1%255~2025%22,%22bg1%252~ITSVP%22,%22bgp%254~1%22,%22bgp%254~2%22,%22bgp%254~3%22,%22bgp%254~4%22,%22bgp%254~5%22,%22bgp%254~6%22,%22bgp%254~7%22,%22bgp%254~8%22,%22bgp%254~9%22,%22bgp%254~10%22,%22bgp%254~11%22,%22bgp%254~12%22,%22bgi%251~N%22%5D');

  const toggleWrapper = page.locator('app-source-uses .toggle-view-top');

  const toggleK = toggleWrapper.locator('span:text("$K")');
  await expect(toggleK).toBeVisible({ timeout: 20000 });
  await toggleK.click();
  await page.waitForTimeout(3000);

  await expect(page.locator('body')).toHaveScreenshot('sr-sources-uses-k-mode.png', {
    animations: 'disabled',
  });

  const toggleM = toggleWrapper.locator('span:text("$M")');
  await toggleM.click();
  await page.waitForTimeout(3000);

  await expect(page.locator('body')).toHaveScreenshot('sr-sources-uses-m-mode.png', {
    animations: 'disabled',
  });
});
