test('Verify IBRD widget titles are visible', async ({ page }) => {
  await page.goto('https://mgmtqa.asestg.worldbank.org/operation_highlight/ibrd', {
    waitUntil: 'domcontentloaded',
  });

  const widgetTitles = [
    'Commitments',
    'Gross Disbursements',
    'Net Flows (IBRD)',
    'Loans Outstanding',
    'Undisbursed Balances',
  ];

  for (const title of widgetTitles) {
    const titleLocator = page.getByText(title, { exact: true });

    // Scroll to the element if it's not in view
    await titleLocator.scrollIntoViewIfNeeded();

    // Assert visibility
    await expect(titleLocator).toBeVisible({ timeout: 15000 });
  }
});
