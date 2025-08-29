console.log('➡️ Please log in once here (SSO/MFA)...');

// Wait until URL just *matches* (don’t care about background requests)
await page.waitForFunction(() => window.location.href.includes('sources-uses'), {
  timeout: 180000, // 3 minutes max
});

// Give it a couple seconds for tokens to settle
await page.waitForTimeout(3000);

// Save auth state (cookies + storage)
await context.storageState({ path: authPath });
console.log(`✅ Saved FULL auth state to ${authPath}`);
