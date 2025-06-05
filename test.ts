{
  "/api": {
    "target": "https://biservicesqa.worldbank.org",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/api": "" }
  },
  "/fc-api": {
    "target": "https://mds.worldbank.org",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/fc-api": "" }
  },
  "/profile-api": {
    "target": "https://reports.worldbank.org",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/profile-api": "" }
  },
  "/sharepoint-api": {
    "target": "https://worldbankgroup.sharepoint.com",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/sharepoint-api": "" }
  }
}
