// In your `embedRpt()` method, change settings:
settings: {
  ...,
  layoutType: models.LayoutType.Custom,
  customLayout: {
    displayOption: models.DisplayOption.FitToWidth // or use `FitToPage` if better
  }
}
