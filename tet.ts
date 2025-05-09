ngAfterViewInit(): void {
  this.Subscribe = this.powerBiRSApi.getStandardReports().subscribe(data => {
    this.LoadFavReport();
    this.onreportinitialload();
    this.prousercheck();

    // Zoom detection logic
    let previousZoom = window.devicePixelRatio;

    window.addEventListener('resize', () => {
      const newZoom = window.devicePixelRatio;
      if (newZoom !== previousZoom) {
        previousZoom = newZoom;

        // ✅ Force Power BI report to re-render at new zoom level
        if (this.currentEmbedObject) {
          this.currentEmbedObject.updateSettings({
            layoutType: this.pbiModels.LayoutType.Custom,
            customLayout: {
              displayOption: this.pbiModels.DisplayOption.FitToWidth
            }
          });
        }
      }
    });
  });
}
