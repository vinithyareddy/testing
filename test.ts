"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
    "browserTarget": "coreframework:build"
  },
  "configurations": {
    "production": {
      "browserTarget": "coreframework:build:production"
    },
    "development": {
      "browserTarget": "coreframework:build:development"
    }
  }
}
