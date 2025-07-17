import { test, expect } from '@playwright/test';

test.describe('Side Nav Menu Navigation with Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Navigate to Budget at a Glance', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Budget at a Glance' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/budget-glance/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-budget-at-a-glance.png');
  });

  test('Navigate to Sources & Uses', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Sources & Uses' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/sources-uses/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-sources-uses.png');
  });

  test('Navigate to WPA', async ({ page }) => {
    const link = page.getByRole('link', { name: 'WPA' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/wpa/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-wpa.png');
  });

  test('Navigate to Budget & Expenses', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Budget & Expenses' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/budget-expenses/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-budget-expenses.png');
  });

  test('Navigate to Collaboration', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Collaboration' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/collaboration/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-collaboration.png');
  });

  test('Navigate to Commitment Balance', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Commitment Balance' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/commitment-balance/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-commitment-balance.png');
  });

  test('Navigate to TRS & Staff Cost', async ({ page }) => {
    const link = page.getByRole('link', { name: 'TRS & Staff cost' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/trs-staff-cost/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-trs-staff-cost.png');
  });

  test('Navigate to Travel', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Travel' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/travel/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-travel.png');
  });

  test('Navigate to External Funds', async ({ page }) => {
    const link = page.getByRole('link', { name: 'External funds' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/external-funds/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-external-funds.png');
  });

  test('Navigate to HR Reports for BPS staff', async ({ page }) => {
    const link = page.getByRole('link', { name: 'HR Reports for BPS staff' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/hr-reports/);
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('nav-hr-reports.png');
  });
});
