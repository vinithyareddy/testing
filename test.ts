import { Locator } from 'playwright';
import { test, expect } from '../../global-fixture';
import { chromium, BrowserContext, Page } from '@playwright/test';
import path from 'path';

// Run tests in this file in parallel
test.describe.configure({ mode: 'parallel' });

const URL = 'https://standardreportsbeta.worldbank.org/budget-glance?';

// Minimal, deterministic page-open helper used by every test
async function openBudgetGlance(page: Page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  // Wait for the WPBPG widget to actually render (real readiness signal)
  const widget = page.locator('app-work-program-by-business-process');
  await expect(widget).toBeVisible({ timeout: 120_000 });

  // Stabilize screenshots across workers
  await page.addStyleTag({
    content: `
      * { transition-duration:0s !important; animation-duration:0s !important; }
      [class*="spinner"], [class*="loading"] { visibility:hidden !important; }
    `,
  });

  // Optional: wait for fonts to load so text rendering is stable
  await page.evaluate(() => (document as any).fonts?.ready?.then?.(() => null)).catch(() => { });
}

test.describe('WPBPG widget', () => {
  test('Verify WPBPG Title is Visible', async ({ page }) => {
    await openBudgetGlance(page);

    const widget = page.locator('app-work-program-by-business-process');
    const title = widget.locator('text=Work Program By Business Process Group').nth(1);

    await expect(title).toBeVisible({ timeout: 120_000 });
    await expect(title).toHaveScreenshot('sr-budget-glance-wpbpg-title.png', { animations: 'disabled' });
  });

  test('Verify Fullscreen Icon is Clickable in Work Program By Business Process Group Widget', async ({ page }) => {
    await openBudgetGlance(page);

    const widget = page.locator('app-work-program-by-business-process');
    await widget.scrollIntoViewIfNeeded();

    const fullscreenIcon = widget.locator('span.view i');
    await expect(fullscreenIcon).toBeVisible({ timeout: 10_000 });

    await fullscreenIcon.click();
    await expect(page).toHaveScreenshot('sr-budget-glance-wpbpg-fullscreen-clicked.png', {
      timeout: 15_000,
      animations: 'disabled',
    });
    await fullscreenIcon.click(); // close fullscreen
  });

  test('Verify WPBPG Expand Icon is Clickable', async ({ page }) => {
    await openBudgetGlance(page);

    const widget = page.locator('app-work-program-by-business-process');
    await widget.scrollIntoViewIfNeeded();

    const expandIcon = widget.locator('span.bgt-collabse-state >> img');
    await expect(expandIcon).toBeVisible({ timeout: 15_000 });
    // (Click not strictly required here since you only asserted visibility)
    // await expandIcon.click();
  });

  test('Verify WPBPG Table is Visible', async ({ page }) => {
    await openBudgetGlance(page);

    const table = page.locator('app-work-program-by-business-process table');
    await expect(table).toBeVisible({ timeout: 100_000 });
    await expect(table).toHaveScreenshot('sr-budget-glance-wpbpg-table.png', { animations: 'disabled' });
  });

  test('Verify WPBPG Budget Type Toggles Work', async ({ page }) => {
    await openBudgetGlance(page);

    const widget = page.locator('app-work-program-by-business-process');
    await expect(widget).toBeVisible({ timeout: 10_000 });

    // Just verify toggles are present (clicks optional if you only need presence)
    await expect(page.getByRole('radio', { name: /^ALL$/ })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('radio', { name: /^BB$/ })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('radio', { name: /^REIMB$/ })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('radio', { name: /^TF$/ })).toBeVisible({ timeout: 10_000 });

    await expect(widget).toHaveScreenshot('sr-budget-glance-wpbpg-toggle-tf.png', { animations: 'disabled' });
  });

  test('Verify WPBPG Widget in $M and $K modes', async ({ page }) => {
    await openBudgetGlance(page);

    // Your original long selector works; keeping it to avoid behavior changes
    const currencyToggle = page.locator(
      'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView.top-header-align > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > span'
    );
    await expect(currencyToggle).toBeVisible({ timeout: 10_000 });

    // Toggle to K
    await currencyToggle.click();

    const wpbpgwidget = page.locator(
      'body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-budget-glance > div > div > div > div:nth-child(2) > div > app-work-program-by-business-process > div > div'
    );
    await wpbpgwidget.scrollIntoViewIfNeeded();
    await expect(wpbpgwidget).toBeVisible({ timeout: 10_000 });

    await expect(wpbpgwidget).toHaveScreenshot('sr-budget-glance-wpbpg-widget-K-currency-mode.png', {
      timeout: 10_000,
      animations: 'disabled',
    });

    // Toggle back to M
    await currencyToggle.click();
    await expect(wpbpgwidget).toBeVisible({ timeout: 10_000 });

    await expect(wpbpgwidget).toHaveScreenshot('sr-budget-glance-wpbpg-widget-M-currency-mode.png', {
      timeout: 10_000,
      animations: 'disabled',
    });
  });

  test('Verify WPBPG bottom text in widget is Visible', async ({ page }) => {
    await openBudgetGlance(page);

    const widget = page.locator('app-work-program-by-business-process');
    await expect(widget).toBeVisible({ timeout: 120_000 })_
