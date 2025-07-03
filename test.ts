import { test, expect } from '@playwright/test';

// --- Basic Page Validation ---
test('Page loads with correct title', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await expect(page).toHaveTitle('Management Dashboard');
});

test('Has visible header text: IBRD+IDA', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await expect(page.getByText('IBRD+IDA')).toBeVisible();
});

// --- View Toggle ---
test('Switch to Classic view', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await page.getByRole('link', { name: 'Classic' }).click();
});

test('Switch back to Card view', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await page.getByRole('link', { name: 'Classic' }).click();
  await page.getByRole('link', { name: 'Card' }).click();
  await expect(page.getByText('Total Commitment')).toBeVisible();
});

// --- Metrics Presence ---
test('Shows Total Commitment', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await expect(page.getByText('Total Commitment')).toBeVisible();
});

test('Shows Gross Disbursements section', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await expect(page.getByText('Gross Disbursements')).toBeVisible();
});

// --- Data Blocks ---
test('Shows o/w Guarantees label', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await expect(page.getByText('o/w Guarantees')).toBeVisible();
});

test('Total Commitment shows 0%', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await expect(page.getByText('0%')).toBeVisible();
});

// --- Tab Check ---
test('FY TO DATE tab is visible', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await expect(page.getByRole('tab', { name: 'FY TO DATE' })).toBeVisible();
});

// --- Dropdown & Column ---
test('COLUMNS dropdown opens in Classic view', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await page.getByRole('link', { name: 'Classic' }).click();
  await page.getByRole('link', { name: 'COLUMNS' }).click();
  await expect(page.getByText('All Columns')).toBeVisible();
});

// --- Table Checks ---
test('Contains text FY25 Q3', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await page.getByRole('link', { name: 'Classic' }).click();
  await expect(page.getByText('FY25 Q3')).toBeVisible();
});

test('Private Capital Mobilization row visible', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await page.getByRole('link', { name: 'Classic' }).click();
  await expect(page.getByText('Private Capital Mobilization')).toBeVisible();
});

// --- Search & Tooltip ---
test('Search bar accepts input', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  await page.getByRole('link', { name: 'Classic' }).click();
  const input = page.locator('input[placeholder="Search"]');
  await input.fill('FY24');
  await expect(page.getByText('FY24')).toBeVisible();
});

test('Tooltip info icon appears on hover', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  const icon = page.locator('i.fa-info-circle');
  await icon.hover();
  await expect(page.locator('[role="tooltip"]')).toBeVisible();
});

// --- Download Buttons ---
test('Two download buttons visible', async ({ page }) => {
  await page.goto('https://mgmtdashboard.worldbank.org/operation_highlight/ibrdida');
  const buttons = await page.locator('button:has-text("Download")').count();
  expect(buttons).toBeGreaterThanOrEqual(2);
});
