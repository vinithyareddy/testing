test('Verify QA Review Data Modal Works', async ({ page }) => {
  await page.waitForTimeout(6000);

  const qaReviewDataBtn = page.locator('text="QA Review Data"');
  await qaReviewDataBtn.waitFor({ state: 'visible', timeout: 120000 });
  await expect(qaReviewDataBtn).toHaveScreenshot('qa-review-data-visible.png');

  // Open modal
  await qaReviewDataBtn.click();
  await page.waitForTimeout(3000); // Allow full modal rendering
  await expect(page).toHaveScreenshot('qa-review-data-modal-open.png');

  // Step 1: Locate modal container (inspect for something like `.modal-dialog`, `.mat-dialog-container`, etc.)
  const modalContainer = page.locator('div.modal-dialog'); // Adjust this based on actual structure
  await modalContainer.waitFor({ state: 'visible', timeout: 10000 });

  // Step 2: Use scoped selectors
  const fy24Tab = modalContainer.locator('text=FY24');
  await fy24Tab.waitFor({ state: 'visible', timeout: 10000 });
  await fy24Tab.click();
  await page.waitForTimeout(1500);
  await expect(modalContainer).toHaveScreenshot('qa-review-data-fy24.png');

  const fy23Tab = modalContainer.locator('text=FY23');
  await fy23Tab.waitFor({ state: 'visible', timeout: 10000 });
  await fy23Tab.click();
  await page.waitForTimeout(1500);
  await expect(modalContainer).toHaveScreenshot('qa-review-data-fy23.png');

  // Close modal
  const closeBtn = modalContainer.locator('i.fa.fa-times.float-right');
  await closeBtn.waitFor({ state: 'visible', timeout: 10000 });
  await closeBtn.click();
  await page.waitForTimeout(2000);
  await expect(page).toHaveScreenshot('qa-review-data-modal-closed.png');
});
