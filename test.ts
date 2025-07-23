test('Verify Clear Option Works', async ({ page }) => {
  test.setTimeout(180000); // Keep as is for safety

  const clearBtn = page.getByRole('button', { name: 'Clear' });

  // Open filter tab only if the clear button is NOT visible
  if (!(await clearBtn.isVisible())) {
    const filterTab = page.locator('app-trs-staffcost lift-tag label.tag-button-switch');

    await filterTab.waitFor({ state: 'visible', timeout: 30000 });

    await filterTab.click(); // open filter drawer
    await page.waitForTimeout(3000); // wait for panel animation
  }

  // Wait for the Clear button and capture screenshot
  await clearBtn.waitFor({ state: 'visible', timeout: 30000 });

  await expect(clearBtn).toBeVisible();

  await expect(clearBtn).toHaveScreenshot('sr-trs-filter-clear-btn.png');
});
