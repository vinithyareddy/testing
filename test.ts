const thirdRow = widget.locator('table tbody tr:nth-child(3)');
const plusIcon = thirdRow.locator('td i'); // scoped within 3rd row

await plusIcon.first().waitFor({ state: 'visible', timeout: 5000 });
await plusIcon.first().click();
