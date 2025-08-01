test('Verify Info Icon and Tooltip for 3 Yr Trend', async ({ page }) => {
  await page.waitForTimeout(3000);

  // Step 1: Locate and verify info icon
  const infoIcon = page.locator('lift-popover.ng-star-inserted');
  await infoIcon.waitFor({ state: 'visible', timeout: 120000 });
  await expect(infoIcon).toHaveScreenshot('info-icon-visible.png');

  // Step 2: Click the info icon to open tooltip
  await infoIcon.click();
  await page.waitForTimeout(1500);

  // Step 3: Tooltip content - dynamically added after click
  const tooltip = page.locator('div.popover-body, div.popover-content'); // using OR fallback
  await tooltip.waitFor({ state: 'visible', timeout: 8000 });
  await expect(tooltip).toHaveScreenshot('info-tooltip-visible.png');

  // Optional Debug:
  // const tooltipText = await tooltip.innerText();
  // console.log('Tooltip says:', tooltipText);

  // Step 4: Close tooltip (check for common close icons or button)
  const closeIcon = page.locator('span.far.fa-xmark, button.close, i.fa-times'); // flexible selector
  await closeIcon.waitFor({ state: 'visible', timeout: 6000 });
  await closeIcon.click();
  await page.waitForTimeout(1500);

  // Step 5: Final screenshot after tooltip closes
  await expect(page).toHaveScreenshot('info-tooltip-closed.png');
});
