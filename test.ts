// Expand accordion first
const sourceAccordion = page.getByText('Source of Funds', { exact: true });
await sourceAccordion.click();

// Wait for toggle/arrow inside that accordion (use class or relative selector)
const sourceOfFundsToggle = page.locator('app-budget-refiner lift-accordion-item:has-text("Source of Funds") .item-arrow');
await expect(sourceOfFundsToggle).toBeVisible({ timeout: 10000 });

// Click or continue as needed
await sourceOfFundsToggle.click(); // if needed

// Then handle checkbox appearance
const bbCheckbox = page.getByLabel('BB');
await bbCheckbox.check();