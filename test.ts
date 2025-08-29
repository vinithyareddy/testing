import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/parallel',
  fullyParallel: false,   // ❌ persistent profiles can’t handle many workers
  workers: 1,             // ✅ run sequentially to avoid conflicts
  use: {
    baseURL: 'https://standardreportsbetaqa.worldbank.org',
    headless: false,
    viewport: { width: 1280, height: 900 },
  },
});
