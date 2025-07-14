test('Verify BB Outcome by VPU Title is Visible', async ({ page }) => {
  // Wait for the widget component to load
  const widget = page.locator('app-outcomebyvpu').first();
  await widget.waitFor({ state: 'attached', timeout: 30000 }); // ensure it's in DOM
  await expect(widget).toBeVisible({ timeout: 10000 }); // ensure it's visible

  // Now validate the title
  const title = page.getByText('BB outcome by VPU', { exact: false });
  await expect(title).toBeVisible({ timeout: 10000 });
});
