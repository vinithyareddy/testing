ngAfterViewInit(): void {
  this.Subscribe = this.powerBiRSApi.getStandardReports().subscribe(data => {
    this.LoadFavReport();
    this.onreportinitialload();
    this.prousercheck();

    // ✅ ResizeObserver to trigger Power BI redraw on zoom/resize
    const resizeTarget = document.querySelector('#pbi-container');
    if (resizeTarget) {
      const resizeObserver = new ResizeObserver(() => {
        if (this.currentEmbedObject) {
          this.currentEmbedObject.updateSettings({
            layoutType: this.pbiModels.LayoutType.Custom,
            customLayout: {
              displayOption: this.pbiModels.DisplayOption.FitToWidth
            }
          });
        }
      });
      resizeObserver.observe(resizeTarget as Element);
    }

    // ✅ Manual Zoom: Scale Power BI iframe (if needed)
    let zoom = 1;
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-')) {
        e.preventDefault();
        zoom += (e.key === '+' ? 0.1 : -0.1);
        zoom = Math.max(0.5, Math.min(2, zoom)); // Clamp zoom range

        const iframe = document.querySelector('iframe');
        if (iframe) {
          (iframe as HTMLElement).style.transform = `scale(${zoom})`;
          (iframe as HTMLElement).style.transformOrigin = 'top left';
        }
      }
    });
  });
}
