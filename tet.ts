/* Prevent all scrollbars */
html, body {
  margin: 0;
  padding: 0;
  height: auto;
  overflow: visible !important;
}

/* Remove scroll from Power BI container */
.powerDiv {
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
  width: 100%;
  background-color: #FFFFFF;
  border-top: none;
}

/* Remove scroll from iframe */
:host ::ng-deep iframe {
  width: 100% !important;
  height: auto !important;
  min-height: unset !important;
  overflow: visible !important;
  border: none;
}
layoutType: this.pbiModels.LayoutType.Custom,
  customLayout: {
    displayOption: this.pbiModels.DisplayOption.FitToPage  // 🔁 makes report auto-expand vertically
  },