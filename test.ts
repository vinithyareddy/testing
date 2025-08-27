import { test, expect } from './base-fixture';

test.describe('Sources and Uses Page Tests', () => {

  test.beforeEach(async ({ authenticatedPage }) => {
    // Ensure we're on the correct page before each test
    if (!authenticatedPage.url().includes('sources-uses')) {
      await authenticatedPage.goto('/sources-uses', {
        waitUntil: 'networkidle',
        timeout: 60000
      });
    }
    await authenticatedPage.waitForTimeout(2000);
  });

  test.describe('Header Navigation Tests', () => {
    test('Verify Breadcrumb Navigation', async ({ authenticatedPage: page }) => {
      const breadcrumb = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(1) > div > lift-breadcrumb > nav > ul');
      await breadcrumb.waitFor({ state: 'visible', timeout: 10000 });
      await page.waitForTimeout(500);
      await expect(breadcrumb).toHaveScreenshot('sr-source-uses-breadcrumb-navigation.png');
    });

    test('Verify Page Title - sources and uses', async ({ authenticatedPage: page }) => {
      const heading = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-8.col-md-8.pl-0 > div.pageTitlenew_Budget.mt-1.ng-star-inserted');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveScreenshot('sr-source-uses-title.png');
    });

    test('Verify "Data as of" text is visible (dynamic date)', async ({ authenticatedPage: page }) => {
      const dataAsOf = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-8.col-md-8.pl-0 > div.col-md-12.col-lg-12.text-left.pl-0 > div:nth-child(1) > span:nth-child(1)');
      await expect(dataAsOf).toBeVisible();
      await expect(dataAsOf).toContainText('Data as of');
      await expect(dataAsOf).toHaveScreenshot('sr-source-uses-data-as-of-visible.png');
    });

    test('Verify FY Time Elapsed 100% progress bar is visible', async ({ authenticatedPage: page }) => {
      const fyProgress = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-8.col-md-8.pl-0 > div.col-md-12.col-lg-12.text-left.pl-0');
      await expect(fyProgress).toBeVisible();
      await expect(fyProgress).toHaveScreenshot('sr-source-uses-fy-progress-bar.png');
    });
  });

  test.describe('Currency Toggle Tests', () => {
    test('Verify Currency Toggle ($M / $K) is present', async ({ authenticatedPage: page }) => {
      const toggleContainer = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > span');
      await expect(toggleContainer).toBeVisible();
      await expect(page).toHaveScreenshot('sr-source-uses-currency-toggle-$m.png');
    });

    test('Toggle to $K', async ({ authenticatedPage: page }) => {
      const toggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > div');
      await expect(toggle).toBeVisible({ timeout: 60000 });
      await toggle.click({ force: true });
      await page.waitForTimeout(9000);
      await expect(page).toHaveScreenshot('sr-source-uses-currency-toggle-k.png');
      await toggle.click({ force: true });
    });

    test('Toggle to $M', async ({ authenticatedPage: page }) => {
      const toggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > div');
      await expect(toggle).toBeVisible({ timeout: 60000 });
      await page.waitForTimeout(9000);
      await expect(page).toHaveScreenshot('sr-source-uses-currency-toggle-m.png');
    });
  });

  test.describe('Filter Panel Tests', () => {
    test('Verify Filter button opens and closes filter panel', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(1000);
      const filterButton = page.locator('div.tag-btn', { hasText: 'Filter' });
      await expect(filterButton).toBeVisible({ timeout: 10000 });
      await filterButton.click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot('sr-sources-uses-filter-panel-open.png');

      const closeIcon = page.locator('app-budget-refiner .refiner-header div:nth-child(2) > span > i');
      await expect(closeIcon).toBeVisible({ timeout: 10000 });
      await closeIcon.click();
      await page.waitForTimeout(1000);
    });

    test('Verify Filters Summary Bar displays correct tags', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(6000);
      const filtersSummaryBar = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.banner-sticky.banner-align.p-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item');
      await expect(filtersSummaryBar).toBeVisible({ timeout: 10000 });
      await expect(filtersSummaryBar).toHaveScreenshot('sr-sources-uses-filter-summary-bar-open.png');
    });

    test('Verify Filter Dropdown Shows Expected Options', async ({ authenticatedPage: page }) => {
      const filterButton = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.banner-sticky.banner-align.p-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item');
      await filterButton.click();
      await page.waitForTimeout(1000);

      const dropdown = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.banner-sticky.banner-align.p-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > div');

      await expect(page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.banner-sticky.banner-align.p-0 > div > app-budget-banner-section > div > lift-accordion > div > lift-accordion-item > div > div > div > div:nth-child(1) > span.fnt-filter')).toBeVisible();

      await dropdown.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(dropdown).toHaveScreenshot('sr-sources-uses-filter-dropdown-options.png');
      await filterButton.click();
    });

    test('Apply Fund Center Filter', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(2000);
      const filterTab = page.locator('div.tag-btn', { hasText: 'Filter' });
      await filterTab.click();
      await page.waitForTimeout(1000);

      const fundCenterArrow = page.locator('lift-accordion:nth-child(3) a div.item-arrow > i');
      await fundCenterArrow.waitFor({ state: 'visible', timeout: 10000 });
      await page.waitForTimeout(1500);

      const selectDropdown = page.locator('angular2-multiselect div.selected-list > div');
      await selectDropdown.waitFor({ state: 'visible', timeout: 10000 });
      await selectDropdown.click();
      await page.waitForTimeout(1500);

      const firstCheckbox = page.locator('angular2-multiselect .dropdown-list ul > li:nth-child(1) > label');
      await firstCheckbox.waitFor({ state: 'visible', timeout: 10000 });
      await firstCheckbox.click();
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('sr-sources-uses-filter-panel-fund-center-option-check.png', { timeout: 10000, animations: 'disabled' });

      await selectDropdown.click();
      await page.waitForTimeout(1000);
      await fundCenterArrow.click();
      await page.waitForTimeout(1000);

      const applyBtn = page.locator('button:has-text("Apply")');
      await applyBtn.click();
    });
  });

  test.describe('Projected BB Outcome Widget Tests', () => {
    test('Verify Projected BB Outcome Title is Visible', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(3000);
      const title = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(1) > div > div > div.col-sm-8 > div.budget-box-h1');
      await title.waitFor({ state: 'visible', timeout: 15000 });
      await expect(title).toBeVisible();
      await page.waitForTimeout(3000);
      await expect(title).toHaveScreenshot('sr-sources-uses-projected-bb-outcome-title.png');
    });

    test('Verify Projected BB Outcome Widget in $M and $K modes', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(10000);
      const currencyToggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2)');
      await expect(currencyToggle).toBeVisible({ timeout: 10000 });
      await currencyToggle.click();
      await page.waitForTimeout(9000);

      const bbOutcomeWidget = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(1) > div');
      await bbOutcomeWidget.scrollIntoViewIfNeeded();
      await expect(bbOutcomeWidget).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(6000);
      await expect(bbOutcomeWidget).toHaveScreenshot('sr-sources-uses-bb-outcome-widget-M-mode.png', { timeout: 10000, animations: 'disabled' });

      await currencyToggle.click();
      await page.waitForTimeout(1000);
      await expect(bbOutcomeWidget).toHaveScreenshot('sr-sources-uses-bb-outcome-widget-K-mode.png', { timeout: 10000, animations: 'disabled' });
    });

    test('Verify Money Bag Icon is Visible', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(1000);
      const icon = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(1) > div > div > div.com-sm-4.textwidth > img');
      await page.waitForTimeout(3000);
      await expect(icon).toBeVisible();
      await expect(icon).toHaveScreenshot('sr-sources-uses-moneybag-icon.png');
    });

    test('Verify Forecast Sources and Uses Values Are Visible', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(2000);
      const sourcesValue = page.locator('text=Forecast Sources');
      const usesValue = page.locator('text=Forecast Uses');
      await sourcesValue.scrollIntoViewIfNeeded();
      await expect(sourcesValue).toBeVisible({ timeout: 10000 });
      await usesValue.scrollIntoViewIfNeeded();
      await expect(usesValue).toBeVisible({ timeout: 10000 });
      await expect(sourcesValue).toHaveScreenshot('sr-sources-uses-forecast-value.png', {
        animations: 'disabled',
      });
      await expect(usesValue).toHaveScreenshot('sr-sources-usesprojected-bb-outcome-value.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Previous FY BB Outcome Widget Tests', () => {
    test('Verify Previous FY BB outcome widget Title is Visible', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(1000);
      const title = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(2) > div > div > div.col-sm-8 > div.budget-box-h1');
      await expect(title).toBeVisible();
      await expect(title).toHaveScreenshot('sr-sources-uses-previous-fy-bb-outcome-title.png');
    });

    test('Verify Previous FY BB outcome widget in $M and $K modes', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(1000);
      const currencyToggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2)');
      await expect(currencyToggle).toBeVisible({ timeout: 10000 });
      await currencyToggle.click();
      await page.waitForTimeout(9000);

      const prevfybbwidget = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(2) > div');
      await prevfybbwidget.scrollIntoViewIfNeeded();
      await expect(prevfybbwidget).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(3000);
      await expect(prevfybbwidget).toHaveScreenshot('sr-sources-uses-previous-fy-bb-outcome-M-mode.png', { timeout: 10000, animations: 'disabled' });

      await currencyToggle.click();
      await page.waitForTimeout(1000);
      await expect(prevfybbwidget).toHaveScreenshot('sr-sources-uses-previous-fy-bb-outcome-K-mode.png', { timeout: 10000, animations: 'disabled' });
    });

    test('Verify Money Bag Icon is Visible in Previous FY', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(1000);
      const icon = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(2) > div > div > div.com-sm-4.textwidth > img');
      await expect(icon).toBeVisible();
      await expect(icon).toHaveScreenshot('sr-sources-uses-previous-fy-bb-outcome-moneybag-icon.png');
    });

    test('Verify Actuals and Final Plans Are Visible', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(1000);
      const actualsources = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(2) > div > div > div.col-sm-8 > div.budget-box-h3.mt-3');
      const actualuses = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(2) > div > div > div.col-sm-8 > div.budget-box-h3.mt-1');

      await expect(actualsources).toBeVisible();
      await expect(actualuses).toBeVisible();

      const actualsourcesValue = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(2) > div > div > div.com-sm-4.textwidth > div.budget-box-right.mt-3');
      const actualusesValue = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(2) > div > div > div.com-sm-4.textwidth > div.budget-box-right.mt-3');

      await expect(actualsourcesValue).not.toHaveText('');
      await expect(actualusesValue).not.toHaveText('');
      await expect(actualsourcesValue).toHaveScreenshot('sr-sources-uses-previous-fy-bb-outcome-actual-sources-value.png');
      await expect(actualusesValue).toHaveScreenshot('sr-sources-uses-previous-fy-bb-outcome-actual-uses-value.png');
    });
  });

  test.describe('EF Uses Widget Tests', () => {
    test('Verify EF uses Title is Visible', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(1000);
      const title = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(3) > div > div > div.col-sm-8 > div.budget-box-h1');
      await expect(title).toBeVisible();
      await expect(title).toHaveScreenshot('sr-sources-uses-ef-uses-title.png');
    });

    test('Verify EF widget in $M and $K modes', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(3000);
      const currencyToggle = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > app-budget-top-header > div.container-fluid.sticky.BudgetTopHeaderBgView > div > div:nth-child(2) > div.col-lg-4.col-md-4 > span.toggle-view-top.pr-2 > span:nth-child(2) > lift-toggle > div > label > span');
      await expect(currencyToggle).toBeVisible({ timeout: 10000 });
      await currencyToggle.click();
      await page.waitForTimeout(1000);

      const efwidget = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(3) > div');
      await efwidget.scrollIntoViewIfNeeded();
      await expect(efwidget).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(6000);
      await expect(efwidget).toHaveScreenshot('sr-sources-uses-ef-widget-M-mode.png', { timeout: 10000, animations: 'disabled' });

      await currencyToggle.click();
      await page.waitForTimeout(1000);
      await expect(efwidget).toHaveScreenshot('sr-sources-uses-ef-widget-K-mode.png', { timeout: 10000, animations: 'disabled' });
    });

    test('Verify Money Bag Icon is Visible in EF Widget', async ({ authenticatedPage: page }) => {
      await page.waitForTimeout(1000);
      const icon = page.locator('body > app-root > internal-framework-root > div.content-wrapper > div > div > div.col-md.layout-wrapper > app-source-uses > div > div.row > div > app-top-header-widgets > div > div:nth-child(3) > div > div > div.com-sm-4.textwidth > img');
      await expect(icon).toBeVisible();
      await expect(icon).toHaveScreenshot('sr-sources-uses-ef-uses