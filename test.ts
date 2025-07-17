import { test, expect } from '@playwright/test';

test.describe('Side Nav Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://standardreportsbetaqa.worldbank.org/budget-glance');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Budget at a Glance link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Budget at a Glance' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/budget-glance/);
  });

  test('Sources & Uses link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Sources & Uses' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/sources-uses/);
  });

  test('WPA link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'WPA' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/wpa/);
  });

  test('Budget & Expenses link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Budget & Expenses' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/budget-expenses/);
  });

  test('Collaboration link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Collaboration' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/collaboration/);
  });

  test('Commitment Balance link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Commitment Balance' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/commitment-balance/);
  });

  test('TRS & Staff Cost link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'TRS & Staff cost' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/trs-staff-cost/);
  });

  test('Travel link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Travel' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/travel/);
  });

  test('External Funds link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'External funds' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/external-funds/);
  });

  test('HR Reports for BPS staff link navigates correctly', async ({ page }) => {
    const link = page.getByRole('link', { name: 'HR Reports for BPS staff' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/hr-reports/);
  });
});
