{
  "name": "mgmt-e2ev2",
    "version": "1.0.0",
      "description": "Playwright E2E Tests for Sources and Uses",
        "main": "index.js",
          "scripts": {
    "test": "npx playwright test --workers=3",
      "test:parallel": "npx playwright test --workers=3 --fully-parallel",
        "test:headed": "npx playwright test --workers=3 --headed",
          "test:specific": "npx playwright test tests/parallel/sources-uses.spec.ts --workers=3",
            "test:debug": "npx playwright test --workers=1 --debug",
              "test:update-snapshots": "npx playwright test --update-snapshots --workers=1",
                "report": "npx playwright show-report",
                  "setup": "npx playwright install chrome"
  },
  "keywords": ["playwright", "testing", "e2e"],
    "author": "",
      "license": "ISC",
        "type": "commonjs",
          "devDependencies": {
    "@playwright/test": "^1.53.2",
      "@types/node": "^24.0.10",
        "ts-node": "^10.9.2",
          "typescript": "^5.8.3"
  },
  "dependencies": {
    "exceljs": "^4.4.0",
      "express": "^5.1.0",
        "xlsx": "^0.18.5"
  }
}