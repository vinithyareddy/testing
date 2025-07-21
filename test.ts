test('report next button', async ({ page }) => {
  // Step 1: Click Reports tab
  const reportsTab = page.locator('#REPORTS > a > span');
  await reportsTab.scrollIntoViewIfNeeded();
  await reportsTab.click();

  // Step 2: Click the table icon (report viewer)
  const tableIcon = page.locator('#Reports > div > app-budget-reports-grid > div > div > div > ul > li > img');
  await tableIcon.scrollIntoViewIfNeeded();
  await expect(tableIcon).toBeVisible();
  await tableIcon.click();

  // Step 3: Wait for report UI to load
  await page.waitForTimeout(3000); // Adjust if needed

  // Step 4: Look for a stable selector for the Next button
  const nextBtn = page.locator('.ag-paging-panel button[ref="btNext"]'); // this targets the AG Grid's next button

  await expect(nextBtn).toBeVisible({ timeout: 10000 });
  await nextBtn.scrollIntoViewIfNeeded();

  // Optional: Click next button
  await nextBtn.click();
  await page.waitForTimeout(1000); // wait for page to update

  // Step 5: Screenshot after clicking
  await expect(nextBtn).toHaveScreenshot('sr-sources-uses-reports-next-button-visible.png');
});
